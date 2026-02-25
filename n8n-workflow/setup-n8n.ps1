# ═══════════════════════════════════════════════════════════════════════
#  VitaGloss RD — Setup completo de n8n (compatible n8n 2.x)
#  Crea owner, genera API key, importa workflow, crea variables y activa.
#
#  Ejecutar desde la raíz del proyecto:
#     .\n8n-workflow\setup-n8n.ps1
#
#  PREREQUISITO: Backend corriendo en http://localhost:4000
# ═══════════════════════════════════════════════════════════════════════

$ErrorActionPreference = 'Continue'
$root    = Split-Path -Parent $PSScriptRoot
$wfDir   = "$root\n8n-workflow"
$wfFile  = "$wfDir\vitagloss-ventas.json"
$envFile = "$wfDir\n8n.env"
$n8nBase = "http://localhost:5678"
$ownerEmail    = "admin@vitagloss.com"
$ownerPassword = "Vitagloss2026!"

function Ok   { param($t) Write-Host "  [OK] $t" -ForegroundColor Green }
function Info { param($t) Write-Host "  [..] $t" -ForegroundColor Cyan }
function Warn { param($t) Write-Host "  [!!] $t" -ForegroundColor Yellow }
function Fail { param($t) Write-Host "  [XX] $t" -ForegroundColor Red }

Write-Host ""
Write-Host "  VitaGloss RD — Setup n8n v2.x" -ForegroundColor Cyan
Write-Host "  ─────────────────────────────────────────" -ForegroundColor DarkGray
Write-Host ""

# ── 1. Verificar n8n corriendo ───────────────────────────────────────
Info "Verificando n8n en $n8nBase..."
$running = $false
try {
    Invoke-WebRequest "$n8nBase/healthz" -UseBasicParsing -TimeoutSec 5 | Out-Null
    $running = $true
    Ok "n8n está corriendo"
} catch {}

if (-not $running) {
    Warn "n8n no responde. Arrancando con configuración del n8n.env..."
    if (Test-Path $envFile) {
        Get-Content $envFile | Where-Object { $_ -match '^[^#]' -and $_ -match '=' } | ForEach-Object {
            $p = $_ -split '=',2
            [System.Environment]::SetEnvironmentVariable($p[0].Trim(), $p[1].Trim(), 'Process')
        }
    }
    Start-Process powershell -ArgumentList "-WindowStyle Minimized -NoExit -Command n8n start"
    Info "Esperando n8n (hasta 90s)..."
    for ($t = 0; $t -lt 90; $t += 5) {
        Start-Sleep 5
        try { Invoke-WebRequest "$n8nBase/healthz" -UseBasicParsing -TimeoutSec 2 | Out-Null; $running = $true; break } catch {}
        Write-Host "  $t s..." -ForegroundColor DarkGray
    }
    if (-not $running) { Fail "n8n no inició. Instala con: npm install -g n8n"; exit 1 }
    Ok "n8n listo"
    Start-Sleep 3
}

# ── 2. Configurar owner (primera vez) ───────────────────────────────
Info "Verificando si necesita setup inicial..."
try {
    $settings    = Invoke-RestMethod "$n8nBase/rest/settings" -TimeoutSec 5
    $needsSetup  = $settings.data.userManagement.showSetupOnFirstLoad
} catch {
    $needsSetup = $false
}

if ($needsSetup) {
    Info "Creando cuenta owner por primera vez..."
    $body = @{
        email     = $ownerEmail
        firstName = "Admin"
        lastName  = "VitaGloss"
        password  = $ownerPassword
        agree     = $true
    } | ConvertTo-Json
    try {
        Invoke-RestMethod "$n8nBase/rest/owner/setup" -Method POST -Body $body -ContentType 'application/json' -TimeoutSec 15 | Out-Null
        Ok "Owner creado: $ownerEmail"
    } catch {
        Warn "Owner setup error (puede ya existir): $_"
    }
} else {
    Ok "Owner ya configurado"
}

# ── 3. Login y extraer cookie n8n-auth ───────────────────────────────
Info "Iniciando sesión en n8n..."
$n8nCookie = ""
try {
    $loginBody = @{ emailOrLdapLoginId = $ownerEmail; password = $ownerPassword } | ConvertTo-Json
    $resp = Invoke-WebRequest "$n8nBase/rest/login" -Method POST -Body $loginBody `
        -ContentType 'application/json' -TimeoutSec 10 -UseBasicParsing
    # Extraer cookie n8n-auth del header Set-Cookie
    $setCookie = $resp.Headers['Set-Cookie']
    if ($setCookie -is [System.Object[]]) { $setCookieStr = $setCookie -join '; ' } else { $setCookieStr = "$setCookie" }
    if ($setCookieStr -match 'n8n-auth=([^;,\s]+)') {
        $n8nCookie = "n8n-auth=$($Matches[1])"
        Ok "Sesión iniciada (cookie n8n-auth obtenida)"
    } else {
        Warn "Cookie n8n-auth no encontrada. Set-Cookie: $($setCookieStr.Substring(0, [Math]::Min(120, $setCookieStr.Length)))"
        # Intentar igual
        $n8nCookie = ""
    }
} catch {
    Fail "No pude hacer login en n8n: $_"
    exit 1
}

$global:sessionHeaders = @{ 'Cookie' = $n8nCookie; 'Content-Type' = 'application/json' }

function N8nPost  { param($url, $body)
    Invoke-RestMethod "$n8nBase$url" -Method POST -Headers $global:sessionHeaders `
        -Body ($body | ConvertTo-Json -Depth 10) -ContentType 'application/json' -TimeoutSec 10
}
function N8nGet   { param($url)
    Invoke-RestMethod "$n8nBase$url" -Headers $global:sessionHeaders -TimeoutSec 10
}

# ── 4. Crear API Key ─────────────────────────────────────────────────
Info "Generando API key de n8n..."
$apiKey = ""

# Primero: ver si ya está guardada en n8n.env
if (Test-Path $envFile) {
    $savedLine = Get-Content $envFile | Where-Object { $_ -match '^N8N_API_KEY=' } | Select-Object -Last 1
    if ($savedLine) {
        $apiKey = ($savedLine -split '=', 2)[1].Trim()
        Ok "API key recuperada de n8n.env: $($apiKey.Substring(0, [Math]::Min(12,$apiKey.Length)))..."
    }
}

if (-not $apiKey) {
    # Obtener scopes disponibles
    $availableScopes = @()
    try {
        $scopesResp = N8nGet "/rest/api-keys/scopes"
        if ($scopesResp -is [System.Object[]]) { $availableScopes = $scopesResp }
        elseif ($scopesResp.data)              { $availableScopes = $scopesResp.data }
        if ($availableScopes.Count -eq 0)      { $availableScopes = @("workflow:read") }
    } catch {
        $availableScopes = @("workflow:read","workflow:write","workflow:delete",
            "execution:read","execution:write","variable:read","variable:write",
            "tag:read","tag:write")
    }

    # Eliminar key existente (si hay) para poder obtener rawApiKey
    try {
        $keysResp = N8nGet "/rest/api-keys"
        $keysList  = if ($keysResp.data) { $keysResp.data } else { @($keysResp) }
        $oldKey    = $keysList | Where-Object { $_.label -eq 'vitagloss-setup' } | Select-Object -First 1
        if ($oldKey) {
            Invoke-RestMethod "$n8nBase/rest/api-keys/$($oldKey.id)" -Method DELETE `
                -Headers $global:sessionHeaders -TimeoutSec 5 | Out-Null
            Info "Key anterior eliminada (id: $($oldKey.id))"
        }
    } catch { Warn "No pude eliminar key anterior: $_" }

    # Crear key nueva
    $farFuture = [long]4102444800000   # 2100-01-01 en ms
    try {
        $keyResp = N8nPost "/rest/api-keys" @{ label = "vitagloss-setup"; scopes = $availableScopes; expiresAt = $farFuture }
        $apiKey  = if ($keyResp.rawApiKey) { $keyResp.rawApiKey } elseif ($keyResp.data.rawApiKey) { $keyResp.data.rawApiKey } else { $keyResp.apiKey }
        if ($apiKey) {
            Ok "API key creada: $($apiKey.Substring(0, [Math]::Min(12,$apiKey.Length)))..."
            # Guardar en n8n.env para ejecuciones futuras
            $envRaw = Get-Content $envFile -Raw
            if ($envRaw -match 'N8N_API_KEY=') {
                $envRaw = $envRaw -replace 'N8N_API_KEY=.*', "N8N_API_KEY=$apiKey"
                Set-Content $envFile $envRaw -NoNewline
            } else {
                Add-Content $envFile "`nN8N_API_KEY=$apiKey"
            }
        } else {
            Fail "rawApiKey vacío en respuesta: $($keyResp | ConvertTo-Json -Compress)"
        }
    } catch {
        Fail "No pude crear API key: $_"
    }
}

$apiHeaders = @{ 'X-N8N-API-KEY' = $apiKey; 'Content-Type' = 'application/json' }

# ── 5. Obtener token admin del backend VitaGloss ─────────────────────
Info "Obteniendo token admin del backend..."
$adminToken = ""
try {
    $lr = Invoke-RestMethod "http://localhost:4000/api/auth/login" -Method POST `
        -Body '{"email":"admin@vitagloss.com","password":"admin123456"}' `
        -ContentType 'application/json' -TimeoutSec 5
    $adminToken = $lr.token
    Ok "Token admin obtenido"
} catch {
    Warn "Backend no responde en :4000 — variable ADMIN_TOKEN quedará vacía"
}

# ── 6. Crear variables en n8n ────────────────────────────────────────
Info "Creando variables en n8n..."

$bEnv = @{}
if (Test-Path "$root\backend\.env") {
    Get-Content "$root\backend\.env" | Where-Object { $_ -match '^[^#]' -and $_ -match '=' } | ForEach-Object {
        $p = $_ -split '=',2; $bEnv[$p[0].Trim()] = $p[1].Trim()
    }
}

$variables = @(
    @{ key = "WA_SECRET";    value = if ($bEnv['WA_SECRET'])    { $bEnv['WA_SECRET'] }    else { "vitagloss_wa_2026" } },
    @{ key = "VENDOR_PHONE"; value = if ($bEnv['VENDOR_PHONE']) { $bEnv['VENDOR_PHONE'] } else { "18492763532" } },
    @{ key = "API_URL";      value = "http://localhost:4000/api" },
    @{ key = "ADMIN_TOKEN";  value = $adminToken }
)

# n8n variables requieren licencia Enterprise — se inyectan directamente en el workflow
$existingVars = @{}
try {
    $ev = Invoke-RestMethod "$n8nBase/api/v1/variables" -Headers $apiHeaders -TimeoutSec 5
    $ev.data | ForEach-Object { $existingVars[$_.key] = $_.id }
    # Si llegamos aquí, las variables están disponibles
    foreach ($v in $variables) {
        $body = @{ key = $v.key; value = $v.value } | ConvertTo-Json
        try {
            if ($existingVars.ContainsKey($v.key)) {
                Invoke-RestMethod "$n8nBase/api/v1/variables/$($existingVars[$v.key])" `
                    -Method PATCH -Headers $apiHeaders -Body $body -TimeoutSec 5 | Out-Null
                Ok "Variable '$($v.key)' actualizada"
            } else {
                Invoke-RestMethod "$n8nBase/api/v1/variables" `
                    -Method POST -Headers $apiHeaders -Body $body -TimeoutSec 5 | Out-Null
                Ok "Variable '$($v.key)' creada"
            }
        } catch { Warn "Variable '$($v.key)': $_" }
    }
} catch {
    Info "Variables n8n: licencia Community — valores inyectados directamente en el workflow"
}

# ── 7. Importar workflow via API ─────────────────────────────────────
Info "Importando workflow..."
if (-not (Test-Path $wfFile)) { Fail "No existe $wfFile"; exit 1 }

# Cargar JSON como texto y sustituir $vars.XXX por valores reales
$wfRaw = Get-Content $wfFile -Raw

# Mapeo de variables → valores
$varMap = @{
    'WA_SECRET'    = ($bEnv['WA_SECRET']    ?? 'vitagloss_wa_2026')
    'VENDOR_PHONE' = ($bEnv['VENDOR_PHONE'] ?? '18492763532')
    'API_URL'      = 'http://localhost:4000/api'
    'ADMIN_TOKEN'  = $adminToken
}
foreach ($k in $varMap.Keys) {
    $wfRaw = $wfRaw -replace [regex]::Escape("`$vars.$k"), $varMap[$k]
}

$wfJson = $wfRaw | ConvertFrom-Json

# Verificar si ya existe un workflow VitaGloss
$existingWf = $null
try {
    $wfs = Invoke-RestMethod "$n8nBase/api/v1/workflows" -Headers $apiHeaders -TimeoutSec 5
    $existingWf = $wfs.data | Where-Object { $_.name -like "*VitaGloss*" } | Select-Object -First 1
} catch {}

$wfPayload = @{
    name        = $wfJson.name
    nodes       = $wfJson.nodes
    connections = $wfJson.connections
    settings    = if ($wfJson.settings) { $wfJson.settings } else { @{} }
    staticData  = $null
} | ConvertTo-Json -Depth 20

if ($existingWf) {
    # Actualizar workflow existente con valores corregidos
    try {
        Invoke-RestMethod "$n8nBase/api/v1/workflows/$($existingWf.id)" `
            -Method PUT -Headers $apiHeaders -Body $wfPayload -TimeoutSec 15 | Out-Null
        Ok "Workflow actualizado (ID: $($existingWf.id))"
    } catch { Warn "No pude actualizar workflow: $_" }
} else {
    try {
        $created    = Invoke-RestMethod "$n8nBase/api/v1/workflows" `
            -Method POST -Headers $apiHeaders -Body $wfPayload -TimeoutSec 15
        $existingWf = $created
        Ok "Workflow creado (ID: $($created.id))"
    } catch { Warn "Error importando workflow: $_" }
}

# ── 8. Activar workflow ──────────────────────────────────────────────
if ($existingWf) {
    Info "Activando workflow (ID: $($existingWf.id))..."
    $activated = $false
    # Método A: POST /activate
    try {
        Invoke-RestMethod "$n8nBase/api/v1/workflows/$($existingWf.id)/activate" `
            -Method POST -Headers $apiHeaders -ContentType 'application/json' -TimeoutSec 5 | Out-Null
        $activated = $true
    } catch {}
    # Método B: PATCH active:true
    if (-not $activated) {
        try {
            Invoke-RestMethod "$n8nBase/api/v1/workflows/$($existingWf.id)" `
                -Method PATCH -Headers $apiHeaders -Body '{"active":true}' -ContentType 'application/json' -TimeoutSec 5 | Out-Null
            $activated = $true
        } catch {}
    }
    if ($activated) { Ok "Workflow activado" }
    else { Warn "Activa manualmente en $n8nBase" }
}

# ── Resumen ──────────────────────────────────────────────────────────
Write-Host ""
Write-Host "  ═══════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  Setup completado" -ForegroundColor Green
Write-Host "  ═══════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Panel n8n:   $n8nBase" -ForegroundColor White
Write-Host "  Email:       $ownerEmail" -ForegroundColor White
Write-Host "  Password:    $ownerPassword" -ForegroundColor White
Write-Host ""
Write-Host "  Webhook:     $n8nBase/webhook/nuevo-pedido" -ForegroundColor Green
Write-Host ""
Write-Host "  PRUEBA rapida (pega en PowerShell):" -ForegroundColor Yellow
Write-Host @"
  Invoke-RestMethod http://localhost:4000/api/orders -Method POST ``
    -ContentType 'application/json' ``
    -Body '{
      "nombre":"Test Cliente",
      "whatsapp":"18091234567",
      "items":[{"nombre":"Glister Pasta Dental","articulo":"110661","cantidad":1,"precio":1350}],
      "total":1350
    }'
"@ -ForegroundColor DarkGray
Write-Host ""
