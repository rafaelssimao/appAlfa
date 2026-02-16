# Script para atualizar Node.js no Windows (via winget)
# Execute no PowerShell: .\scripts\atualizar-node.ps1

Write-Host "Atualizando Node.js LTS via winget..." -ForegroundColor Cyan
winget install OpenJS.NodeJS.LTS --accept-package-agreements --accept-source-agreements

Write-Host "`nFeche e reabra o terminal (ou o Cursor) e rode 'node -v' para conferir." -ForegroundColor Green
Write-Host "Versao esperada: v20.x ou v22.x" -ForegroundColor Green
