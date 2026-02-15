# -------------------------------
# deploy-all.ps1
# -------------------------------

# Configuración
$FRONTEND_DIR = "C:\Users\Casa\Paris-Boheme\frontend"
$BACKEND_DIR = "C:\Users\Casa\paris-boheme-api"
$FRONTEND_URL = "https://paris-boheme.vercel.app"  # URL del frontend
$BACKEND_URL = "https://tu-backend.onrender.com"    # URL del backend

# -------------------------------
# Backend: actualizar CORS y deploy
# -------------------------------

Write-Host "`n=== Backend: actualizar CORS ==="

# Ruta del archivo CORS
$CORS_FILE = Join-Path $BACKEND_DIR "src/config/cors.ts"

# Crear carpeta si no existe
$CORS_FOLDER = Split-Path $CORS_FILE
if (-not (Test-Path $CORS_FOLDER)) {
    New-Item -ItemType Directory -Path $CORS_FOLDER -Force
}

# Escribir la URL del frontend
$CORS_CONTENT = @"
export const FRONTEND_URL = '$FRONTEND_URL';
"@
Set-Content -Path $CORS_FILE -Value $CORS_CONTENT -Encoding UTF8
Write-Host "✔ CORS actualizado a $FRONTEND_URL"

# Ir al repo backend
Set-Location $BACKEND_DIR

# Detectar cambios git
$gitStatus = git status --porcelain
if ($gitStatus) {
    git add .
    $commitMsg = "Update CORS and deploy $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
    try {
        git commit -m $commitMsg
        git push
        Write-Host "✔ Backend push realizado"
    } catch {
        Write-Host "⚠ No hay cambios para commitear en backend"
    }
} else {
    Write-Host "⚠ No hay cambios en backend"
}

# -------------------------------
# Frontend: limpiar node_modules, build y deploy
# -------------------------------

Write-Host "`n=== Frontend: limpiar y build ==="

Set-Location $FRONTEND_DIR

# Limpiar node_modules
if (Test-Path "node_modules") {
    Remove-Item "node_modules" -Recurse -Force
    Write-Host "✔ node_modules eliminado"
}

# Instalar dependencias
Write-Host "→ Instalando dependencias..."
npm install --legacy-peer-deps

# Build
Write-Host "→ Generando build..."
npm run build

# Deploy a GitHub Pages (opcional)
# npm run deploy:gh

# Push cambios del frontend
$gitStatus = git status --porcelain
if ($gitStatus) {
    git add .
    $commitMsg = "Frontend build $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
    try {
        git commit -m $commitMsg
        git push
        Write-Host "✔ Frontend push realizado"
    } catch {
        Write-Host "⚠ No hay cambios para commitear en frontend"
    }
} else {
    Write-Host "⚠ No hay cambios en frontend"
}

Write-Host "`n✅ Todo listo para deploy!"
