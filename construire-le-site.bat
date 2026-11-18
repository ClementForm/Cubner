@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo Construction du site CALCUB a partir de contenus\*.xlsx ...
node build\generate.js
if errorlevel 1 (
  echo.
  echo La construction a echoue. Verifiez que Node.js est installe et que le fichier Excel est ferme.
) else (
  echo.
  echo Termine : ouvrez site\plan-du-site.html pour parcourir les pages.
)
pause
