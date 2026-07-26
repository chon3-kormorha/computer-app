@echo off
set "PATH=C:\Program Files\nodejs;%PATH%"
if not exist "node_modules\next" (
    call npm install
)
start "" "http://localhost:8080/"
call npm run dev
