# 📖 Tessell Oracle on GCP — Complete Guide

## Overview

This Terraform project automates Oracle 19c database provisioning on Google Cloud Platform using Tessell DBaaS.

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Tessell Platform                      │
│  ┌────────────────────────────────────────────────────┐ │
│  │         Oracle 19c Database Service                │ │
│  │  ┌──────────────────────────────────────────────┐  │ │
│  │  │  • Engine: Oracle 19c SE2                    │  │ │
│  │  │  • Topology: Single Instance                 │  │ │
│  │  │  • Compute: 4 vCPU (tesl_4_a)               │  │ │
│  │  │  • Storage: Default + Auto-scaling          │  │ │
│  │  │  • Backups: PITR (1-7 days)                 │  │ │
│  │  └──────────────────────────────────────────────┘  │ │
│  └────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
                          │
                          │ Port 1521 (SSL)
                          │
                    ┌─────▼─────┐
                    │  Your IP  │
                    │ Whitelisted│
                    └───────────┘
```

## Features

- ✅ Single-instance Oracle 19c SE2
- ✅ Environment-aware (dev/qa/staging/prod)
- ✅ Automated backups with PITR
- ✅ IP whitelisting for security
- ✅ SSL/TLS encryption
- ✅ Auto minor version updates
- ✅ Production safeguards (deletion protection)

## Prerequisites

### Required
- Terraform >= 1.0
- Tessell account
- GCP subscription (managed by Tessell)

### Get Tessell Credentials
1. **Tenant ID**: Tessell Console → Settings
2. **API Key**: Tessell Console → Profile → API Keys → Create
3. **VPC Name**: Tessell Console → Network → VPCs

## Installation

### 1. Clone/Download Project
```bash
cd tessell-oracle-gcp/terraform
```

### 2. Configure Credentials
```bash
cp terraform.tfvars.example terraform.tfvars
```

Edit `terraform.tfvars`:
```hcl
api_address        = "https://api.tessell.com"
tenant_id          = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
api_key            = "your-api-key"
allowed_ip         = "103.45.12.200"  # Your IP
db_master_password = "SecurePass123!"
```

### 3. Initialize Terraform
```bash
terraform init
```

### 4. Review Plan
```bash
terraform plan
```

### 5. Deploy
```bash
terraform apply
```

## Configuration

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `environment` | `dev` | Environment name (dev/qa/staging/prod) |
| `gcp_region` | `us-central1` | GCP region |
| `vpc_name` | `your-vpc-name` | Tessell VPC name |

### Deploy to Different Environments

```bash
# Development
terraform apply -var="environment=dev"

# QA
terraform apply -var="environment=qa"

# Production
terraform apply -var="environment=prod"
```

## Connecting to Database

### Get Endpoint
1. Tessell Console → DB Services
2. Click your database → Copy endpoint

### SQL*Plus
```bash
sqlplus admin/<password>@<endpoint>:1521/DEVDB
```

### JDBC
```
jdbc:oracle:thin:@<endpoint>:1521:DEVDB
```

### Python (cx_Oracle)
```python
import cx_Oracle
conn = cx_Oracle.connect('admin', '<password>', '<endpoint>:1521/DEVDB')
```

## Outputs

After `terraform apply`, you'll see:

- `db_service_id` — Unique service ID
- `db_service_name` — Service name
- `db_service_status` — Current status
- `connection_instructions` — How to connect
- `environment_config` — Configuration summary

View outputs anytime:
```bash
terraform output
```

## Maintenance

### Update Database
```bash
terraform plan
terraform apply
```

### Destroy Database
```bash
terraform destroy
```

### View State
```bash
terraform show
```

## Troubleshooting

### Issue: "Connection refused"
- Check IP whitelist: `var.allowed_ip`
- Verify endpoint from Tessell Console
- Wait 2-3 minutes for DNS propagation

### Issue: "Invalid credentials"
- Verify `tenant_id` and `api_key`
- Check API key hasn't expired

### Issue: "VPC not found"
- Update `vpc_name` in terraform.tfvars
- Get correct name from Tessell Console → Network

### Issue: Terraform state locked
```bash
# Force unlock (use carefully!)
terraform force-unlock <lock-id>
```

## Best Practices

### Security
- Never commit `terraform.tfvars`
- Use strong passwords (12+ chars)
- Restrict IP whitelist
- Enable deletion protection for prod

### Cost Optimization
- Use `tesl_4_a` for dev/qa
- Enable compute sharing for non-prod
- Set appropriate backup retention

### Team Collaboration
- Use remote state (GCS backend)
- Enable state locking
- Use workspaces for environments

## Remote State Setup

Uncomment in `backend.tf`:
```hcl
terraform {
  backend "gcs" {
    bucket  = "terraform-state-bucket"
    prefix  = "tessell-oracle"
  }
}
```

Create GCS bucket:
```bash
gcloud storage buckets create gs://terraform-state-bucket --location=us-central1
gcloud storage buckets update gs://terraform-state-bucket --versioning
```

Migrate state:
```bash
terraform init -migrate-state
```

## Support

- **Tessell Docs**: https://docs.tessell.com
- **Terraform Provider**: https://registry.terraform.io/providers/tessell-cloud/tessell
- **GCP Regions**: https://cloud.google.com/compute/docs/regions-zones

---

**Version:** 1.0  
**Last Updated:** 2024
