@echo off
chcp 65001 >nul
title MusicUPC - Servidor

REM Ir a la carpeta donde está este archivo .bat
cd /d "%~dp0"

echo ============================================
echo            MusicUPC - Frontend
echo ============================================
echo.

REM Si es la primera vez (no hay dependencias), instalarlas
if not exist "node_modules\" (
    echo Primera vez: instalando dependencias, espera un momento...
    echo.
    call npm install
    echo.
)

echo Arrancando el proyecto...
echo Cuando aparezca "Local: http://localhost:4200/" ya esta listo.
echo Se abrira solo en el navegador en unos segundos.
echo.
echo  Para APAGAR el servidor: pulsa Ctrl + C en esta ventana.
echo ============================================
echo.

REM Abrir el navegador despues de unos segundos (en segundo plano)
start "" /b cmd /c "timeout /t 12 >nul & start http://localhost:4200"

REM Arrancar el servidor de Angular
call npm start

echo.
echo El servidor se ha detenido. Puedes cerrar esta ventana.
pause
