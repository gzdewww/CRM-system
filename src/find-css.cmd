@echo off
chcp 65001 >nul

echo Searching...

for /r . %%F in (*.scss) do (
    findstr "--transition-fast" "%%F" >nul 2>&1
    if not errorlevel 1 (
        echo %%F
        findstr /n "--transition-fast" "%%F"
    )
)
