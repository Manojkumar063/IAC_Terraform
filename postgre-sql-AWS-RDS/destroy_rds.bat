@echo off
echo ==========================================
echo   Terraform RDS Destroy Script
echo ==========================================

terraform destroy -auto-approve

IF %ERRORLEVEL% NEQ 0 (
    echo Terraform destroy failed!
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo Infrastructure destroyed successfully!
pause