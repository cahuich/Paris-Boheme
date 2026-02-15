#!/bin/bash

# =============================
# Script de deploy automático
# Backend en Render, Frontend en Vercel
# =============================

# CONFIGURACIÓN
BACKEND_REPO="paris-boheme-api"
FRONTEND_REPO="paris-boheme"
FRONTEND_DIR="frontend"
RENDER_REMOTE="render"     # Alias git de Render (ver más abajo)
VERCEL_PROJECT="frontend"  # Nombre del proyecto en Vercel CLI
VERCEL_TOKEN=""            # Opcional, si no has iniciado sesión en Vercel CLI

# =============================
# Backend
# =============================
echo "============================="
echo "Subiendo backend a Render..."
echo "============================="

cd ../$BACKEND_REPO || { echo "No se encontró el backend"; exit 1; }

git add .
git commit -m "Deploy backend $(date '+%Y-%m-%d %H:%M:%S')" || echo "No hay cambios para commit"
git push $RENDER_REMOTE main || { echo "Error al hacer push del backend"; exit 1; }

echo "Backend actualizado en Render."

# =============================
# Frontend
# =============================
echo "============================="
echo "Subiendo frontend a Vercel..."
echo "============================="

cd ../$FRONTEND_REPO/$FRONTEND_DIR || { echo "No se encontró el frontend"; exit 1; }

# Instalación de dependencias y build
npm install
npm run build || { echo "Error en build del frontend"; exit 1; }

# Deploy a Vercel usando CLI
if [ -z "$VERCEL_TOKEN" ]; then
    vercel --prod --confirm || { echo "Error en deploy de Vercel"; exit 1; }
else
    vercel --prod --token $VERCEL_TOKEN --confirm || { echo "Error en deploy de Vercel"; exit 1; }
fi

echo "Frontend desplegado en Vercel."

# =============================
# FIN
# =============================
echo "============================="
echo "Deploy completado con éxito ✅"
echo "Backend: https://<tu-backend>.onrender.com"
echo "Frontend: https://<tu-frontend>.vercel.app"
echo "============================="
