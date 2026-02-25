# ═══════════════════════════════════════════════════════
#  VitaGloss RD — Script de arranque completo
#  Ejecutar desde la raíz del proyecto:
#  .\start-all.ps1
# ═══════════════════════════════════════════════════════

Write-Host ""
Write-Host "╔══════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║         VitaGloss RD — Sistema completo              ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

$root = $PSScriptRoot

# 1. Backend API
Write-Host "▶ Iniciando Backend API (puerto 4000)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$root\backend'; npm run dev" -WindowStyle Normal

Start-Sleep -Seconds 2

# 2. Frontend
Write-Host "▶ Iniciando Frontend (puerto 5174)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$root\frontend'; npm run dev" -WindowStyle Normal

Start-Sleep -Seconds 2

# 3. WhatsApp Service
Write-Host "▶ Iniciando Servicio WhatsApp (puerto 3001)..." -ForegroundColor Yellow
Write-Host "  → Luego abre http://localhost:3001/qr?key=vitagloss_wa_2026 para escanear el QR" -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$root\whatsapp-service'; npm run dev" -WindowStyle Normal

Start-Sleep -Seconds 2

# 4. n8n (con variables de entorno pre-cargadas desde n8n.env)
Write-Host "▶ Iniciando n8n (puerto 5678)..." -ForegroundColor Magenta
Write-Host "  → Abre http://localhost:5678 para administrar los workflows" -ForegroundColor Magenta
$n8nStartCmd = @"
# Cargar n8n.env
Get-Content '$root\n8n-workflow\n8n.env' | Where-Object { `$_ -match '^[^#]' -and `$_ -match '=' } | ForEach-Object {
    `$p = `$_ -split '=',2; [System.Environment]::SetEnvironmentVariable(`$p[0].Trim(), `$p[1].Trim(), 'Process')
}
n8n start
"@
Start-Process powershell -ArgumentList "-NoExit", "-Command", $n8nStartCmd -WindowStyle Normal

Write-Host ""
Write-Host "══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  Servicios arrancando en ventanas separadas:" -ForegroundColor White
Write-Host "  🔷 Backend API    →  http://localhost:4000" -ForegroundColor Cyan
Write-Host "  🔷 Frontend       →  http://localhost:5174" -ForegroundColor Cyan
Write-Host "  📱 WhatsApp QR    →  http://localhost:3001/qr?key=vitagloss_wa_2026" -ForegroundColor Green
Write-Host "  🔧 n8n Panel      →  http://localhost:5678  (admin / vitagloss2026)" -ForegroundColor Magenta
Write-Host "══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "PRÓXIMOS PASOS:" -ForegroundColor Yellow
Write-Host "  1. Escanea el QR de WhatsApp en el navegador" -ForegroundColor White
Write-Host "  2. Ejecuta: .\n8n-workflow\setup-n8n.ps1   (importa workflow + variables)" -ForegroundColor White
Write-Host ""
