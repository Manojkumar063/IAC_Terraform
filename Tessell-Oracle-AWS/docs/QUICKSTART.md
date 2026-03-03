# 🚀 Quick Start Guide

## First Time Setup (5 minutes)

### 1. Install Prerequisites
```bash
# Install Terraform
# Windows: choco install terraform
# Mac: brew install terraform
# Linux: https://developer.hashicorp.com/terraform/install

# Verify installation
terraform --version
```

### 2. Get Tessell Credentials
1. Log into Tessell Console
2. Get Tenant ID: Settings → Tenant Info
3. Generate API Key: Profile → API Keys → Generate
4. Note your VPC name: Infrastructure → Networks

### 3. Configure Variables
```bash
# Copy example file
cp terraform.tfvars.example terraform.tfvars

# Edit with your values
# Required:
#   - tenant_id (from step 2)
#   - api_key (from step 2)
#   - vpc_name (from step 2)
#   - allowed_ip (run: curl ifconfig.me)
#   - db_master_password (create a strong password)
```

### 4. Initialize & Deploy
```bash
# Download Terraform providers
terraform init

# Preview what will be created
terraform plan

# Create the database (takes 10-20 minutes)
terraform apply
```

### 5. Connect to Database
After `terraform apply` completes:
1. Get endpoint from Tessell Console → DB Services → oracle-dev
2. Connect:
   ```bash
   sqlplus admin/<password>@<endpoint>:1521/DEVDB
   ```

---

## Daily Workflow

```bash
# Make changes to .tf files
vim main.tf

# Format code
terraform fmt

# Validate syntax
terraform validate

# Preview changes
terraform plan

# Apply changes
terraform apply

# View outputs
terraform output
```

---

## Common Commands

```bash
# Show current state
terraform show

# List all resources
terraform state list

# Get specific output
terraform output -raw db_service_id

# Refresh state from Tessell API
terraform refresh

# Destroy everything
terraform destroy
```

---

## Troubleshooting

### Error: 401 Unauthorized
- Check `api_key` in terraform.tfvars
- Regenerate API key in Tessell Console

### Error: VPC not found
- Verify `vpc_name` matches exactly (case-sensitive)
- Check Tessell Console → Infrastructure → Networks

### Error: Cannot connect to database
- Verify `allowed_ip` matches your current IP: `curl ifconfig.me`
- Check firewall rules in Tessell Console
- Wait 2-3 minutes for DNS propagation

### Provisioning stuck/timeout
- Check Tessell Console for error messages
- Verify subscription has available quota
- Contact Tessell support if issue persists

---

## Multi-Environment Setup

```bash
# Dev environment
terraform apply -var="environment=dev"

# QA environment
terraform apply -var="environment=qa"

# Production (with extra protection)
terraform apply -var="environment=prod"
```

---

## Security Checklist

- ✅ terraform.tfvars is in .gitignore
- ✅ API key is marked sensitive
- ✅ Password meets complexity requirements (12+ chars, mixed case, numbers, symbols)
- ✅ Only your IP is whitelisted
- ✅ SSL is enabled
- ✅ Production has deletion protection enabled

---

## Getting Help

- Terraform Docs: https://registry.terraform.io/providers/tessell-cloud/tessell
- Tessell Support: support@tessell.com
- Team Slack: #infrastructure
