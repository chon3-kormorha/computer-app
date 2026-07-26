@echo off
set PATH=C:\Program Files\nodejs;%PATH%
echo ======================================================================
echo FLOWCHART GAME NEXT.JS + SQLITE APP LAUNCHER
echo School: Ban KM 5 School - Teacher: Ruttana Sopitprasan
echo ======================================================================
if not exist node_modules\.bin\next.cmd (
  echo Installing Next.js dependencies...
  call npm install
)
echo Starting Next.js Dev Server on http://localhost:8080/
start "" "http://localhost:8080/"
call npm run dev
