@echo off
echo ==========================================
echo   Terraform RDS Deployment Script
echo ==========================================

echo.
echo Step 1: Initializing Terraform...
terraform init
IF %ERRORLEVEL% NEQ 0 (
    echo Terraform init failed!
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo Step 2: Validating Terraform files...
terraform validate
IF %ERRORLEVEL% NEQ 0 (
    echo Terraform validation failed!
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo Step 3: Showing Terraform Plan...
terraform plan -out=tfplan
IF %ERRORLEVEL% NEQ 0 (
    echo Terraform plan failed!
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo Step 4: Applying Terraform Plan...
terraform apply tfplan
IF %ERRORLEVEL% NEQ 0 (
    echo Terraform apply failed!
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo Step 5: Displaying Outputs...
terraform output

echo.
echo ==========================================
echo Deployment Completed Successfully!
echo ==========================================
pause