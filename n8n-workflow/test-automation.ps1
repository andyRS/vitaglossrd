# ═══════════════════════════════════════════════════════════
#  VitaGloss RD — Test de integración completa
#  Verifica: Backend → n8n → WhatsApp Service
#
#  Uso: .\n8n-workflow\test-automation.ps1
# ═══════════════════════════════════════════════════════════

function Ok  { param($t) Write-Host "  ✅ $t" -ForegroundColor Green }
function Err { param($t) Write-Host "  ❌ $t" -ForegroundColor Red }
function Info{ param($t) Write-Host "  ℹ  $t" -ForegroundColor Cyan }

Write-Host ""
Write-Host "  VitaGloss — Test automatización WhatsApp" -ForegroundColor Cyan
Write-Host "  ──────────────────────────────────────────" -ForegroundColor DarkGray
Write-Host ""

# ── 1. Backend ────────────────────────────────────────────
try {
    $h = Invoke-RestMethod "http://localhost:4000/api/health" -TimeoutSec 4
    Ok "Backend API corriendo (status: $($h.status))"
} catch { Err "Backend no responde en localhost:4000 — ejecuta: cd backend; npm run dev"; exit 1 }

# ── 2. WhatsApp Service ───────────────────────────────────
try {
    $wa = Invoke-RestMethod "http://localhost:3001/health" -TimeoutSec 4
    if ($wa.ready) {
        Ok "WhatsApp Service conectado ✓"
    } else {
        Write-Host "  ⚠  WhatsApp no conectado — escanea el QR en:" -ForegroundColor Yellow
        Write-Host "     http://localhost:3001/qr?key=vitagloss_wa_2026" -ForegroundColor Yellow
    }
} catch { Err "WhatsApp Service no responde en localhost:3001 — ejecuta: cd whatsapp-service; npm run dev" }

# ── 3. n8n ────────────────────────────────────────────────
try {
    $n8h = Invoke-WebRequest "http://localhost:5678/healthz" -UseBasicParsing -TimeoutSec 4
    Ok "n8n corriendo (status: $($n8h.StatusCode))"
} catch { Err "n8n no responde en localhost:5678 — ejecuta: n8n start   ó   .\start-all.ps1" }

# ── 4. Crear pedido de prueba ──────────────────────────────
Info "Creando pedido de prueba en el backend..."
try {
    $body = @{
        nombre   = "Test Automatico"
        whatsapp = ""
        items    = @(@{ nombre = "Glister Pasta Dental"; articulo = "110661"; cantidad = 1; precio = 1350 })
        total    = 1350
        source   = "test_script"
    } | ConvertTo-Json -Depth 5

    $order = Invoke-RestMethod "http://localhost:4000/api/orders" `
        -Method POST -Body $body -ContentType "application/json" -TimeoutSec 8
    Ok "Pedido creado con ID: $($order.orderId)"
    Info "Si n8n está activo y el workflow en producción, deberías recibir un WA en 5-10 seg"
} catch { Err "Error creando pedido: $_" }

# ── 5. Verificar variables en n8n ─────────────────────────
$root = Split-Path -Parent $PSScriptRoot
$envFile = "$root\n8n-workflow\n8n.env"
if (Test-Path $envFile) {
    $envVars = @{}
    Get-Content $envFile | Where-Object { $_ -match '^\s*[^#]' -and $_ -match '=' } | ForEach-Object {
        $p = $_ -split '=',2; $envVars[$p[0].Trim()] = $p[1].Trim()
    }
    $b64 = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("$($envVars['N8N_BASIC_AUTH_USER']):$($envVars['N8N_BASIC_AUTH_PASSWORD'])"))
    try {
        $vars = Invoke-RestMethod "http://localhost:5678/api/v1/variables" `
            -Headers @{ Authorization = "Basic $b64" } -TimeoutSec 5
        $varNames = $vars.data | ForEach-Object { $_.key }
        $required = @("WA_SECRET","VENDOR_PHONE","API_URL","ADMIN_TOKEN")
        $missing  = $required | Where-Object { $_ -notin $varNames }
        if ($missing.Count -eq 0) {
            Ok "Variables n8n configuradas: $($varNames -join ', ')"
        } else {
            Write-Host "  ⚠  Variables faltantes en n8n: $($missing -join ', ')" -ForegroundColor Yellow
            Write-Host "     Ejecuta: .\n8n-workflow\setup-n8n.ps1" -ForegroundColor Yellow
        }
    } catch { Write-Host "  ⚠  No pude verificar variables n8n (sin auth o apagado)" -ForegroundColor Yellow }
}

Write-Host ""
Info "URLs útiles:"
Write-Host "    Panel n8n:   http://localhost:5678" -ForegroundColor White
Write-Host "    WA QR:       http://localhost:3001/qr?key=vitagloss_wa_2026" -ForegroundColor White
Write-Host "    Dashboard:   http://localhost:5174/dashboard" -ForegroundColor White
Write-Host ""
