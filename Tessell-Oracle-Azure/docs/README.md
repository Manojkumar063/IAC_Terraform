# 🗄️ Tessell Oracle DB on Azure — Terraform Provisioning Guide

> Provision an **Oracle 19c** database on **Azure** using **Tessell DBaaS** and **Terraform** — step by step, from zero to a running database.

---

## 📋 Table of Contents

1. [What is Tessell?](#what-is-tessell)
2. [Architecture Overview](#architecture-overview)
3. [Prerequisites](#prerequisites)
4. [Project Structure](#project-structure)
5. [File-by-File Explanation](#file-by-file-explanation)
6. [Configuration Reference](#configuration-reference)
7. [Step-by-Step Setup](#step-by-step-setup)
8. [Running Terraform](#running-terraform)
9. [Verify the Database](#verify-the-database)
10. [Connect to Oracle DB](#connect-to-oracle-db)
11. [Tear Down](#tear-down)
12. [Troubleshooting](#troubleshooting)
13. [Dev/QA vs Production Differences](#devqa-vs-production-differences)
14. [Security Best Practices](#security-best-practices)

---

## What is Tessell?

**Tessell** is a cloud-native **Database-as-a-Service (DBaaS)** platform that manages your databases on AWS or Azure. Instead of manually setting up VMs, installing Oracle, configuring backups, and managing patches — Tessell does all of that for you via API.

**Terraform + Tessell** = You write infrastructure code → Tessell provisions and manages the Oracle DB automatically.

```
You write .tf files  →  terraform apply  →  Tessell API  →  Oracle DB running on Azure
```

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                  Your Machine                       │
│                                                     │
│   terraform apply ──────────────────────────────►   |
│                                                     │
└──────────────────────────────┬──────────────────────┘
                               │ HTTPS API Call
                               ▼
┌─────────────────────────────────────────────────────┐
│               Tessell Control Plane                 |       
│          (api.tessell.com)                          │
│                                                     │
│   Authenticates → Validates → Provisions            │
└──────────────────────────────┬──────────────────────┘
                               │ Provisions
                               ▼
┌─────────────────────────────────────────────────────┐
│                 Microsoft Azure                     │
│                                                     │
│   ┌─────────────────────────────────────────────┐   │
│   │         Tessell VNet (your VPC)             │   │
│   │                                             │   │
│   │   ┌──────────────────────────────────────┐  │   │
│   │   │      Oracle 19c SE2 Instance         │  │   │
│   │   │      (single_instance - Dev/QA)      │  │   │
│   │   │      Port: 1521                      │  │   │
│   │   │      Compute: tesl_4_a (4 vCPU)      │  │   │
│   │   │      DB: DEVDB                       │  │   │
│   │   └──────────────────────────────────────┘  │   │
│   │                                             │   │
│   └─────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

---

## Prerequisites

Before you begin, make sure you have:

| Requirement | How to Get It |
|---|---|
| **Terraform** installed (>= 1.0) | [Download here](https://developer.hashicorp.com/terraform/install) |
| **Tessell Account** | Sign up at your org's Tessell portal |
| **Tessell API Key** | Tessell Console → Profile → API Keys |
| **Tessell Tenant ID** | Tessell Console → Settings → Tenant Info |
| **Tessell Subscription Name** | Tessell Console → Subscriptions |
| **VPC/VNet Name** | Tessell Console → Infrastructure → Networks |
| **Your IP Address** | Run: `curl ifconfig.me` |

### Verify Terraform is installed:
```bash
terraform --version
# Should output: Terraform v1.x.x
```

---

## Project Structure

```
tessell-oracle-azure/
│
├── provider.tf          # Tessell provider + Terraform version config
├── variables.tf         # Variable declarations (types + descriptions)
├── terraform.tfvars     # Actual secret values (⚠️ NEVER commit to git)
├── main.tf              # The Oracle DB resource definition
├── outputs.tf           # What to display after provisioning
└── README.md            # This file
```

---

## File-by-File Explanation

### `provider.tf` — Connects Terraform to Tessell
```hcl
terraform {
  required_providers {
    tessell = {
      source = "tessell-cloud/tessell"
    }
  }
}

provider "tessell" {
  api_address = var.api_address   # Where Tessell API lives
  tenant_id   = var.tenant_id     # Your organization's unique ID
  api_key     = var.api_key       # Your personal API key for authentication
}
```
> **Think of this like:** Setting up your login credentials before making API calls.

---

### `variables.tf` — Variable Declarations
```hcl
variable "api_address" {
  type        = string
  description = "Tessell API endpoint URL"
}

variable "tenant_id" {
  type        = string
  description = "Your Tessell Tenant UUID"
}

variable "api_key" {
  type        = string
  sensitive   = true  # Hides value in terminal output
  description = "Tessell API Key (never commit this!)"
}

variable "allowed_ip" {
  type        = string
  description = "Your machine IP to allow DB access"
}

variable "db_master_password" {
  type        = string
  sensitive   = true
  description = "Oracle master user password"
}
```
> **Think of this like:** Declaring the shape of your `.env` file — no values yet, just the names and types.

---

### `terraform.tfvars` — Actual Values ⚠️ Keep Secret
```hcl
api_address        = "https://api.tessell.com"
tenant_id          = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
api_key            = "your-api-key-here"
allowed_ip         = "103.45.12.200"    # Run: curl ifconfig.me
db_master_password = "MyStr0ng@Password123"
```
> ⚠️ **Add this to `.gitignore` immediately!** This file contains secrets.

```bash
echo "terraform.tfvars" >> .gitignore
```

---

### `main.tf` — The Oracle DB Resource (Core File)
```hcl
resource "tessell_db_service" "oracle_dev_qa" {

  # Basic Info
  name        = "oracle-dev-qa"
  description = "Oracle 19c Dev/QA DB on Azure"
  subscription = "default"

  # Engine
  engine_type            = "ORACLE"
  edition                = "STANDARD"          # STANDARD = cheaper, good for Dev/QA
  topology               = "single_instance"   # No HA needed for Dev/QA
  software_image         = "Oracle 19c SE2"
  software_image_version = "19.17.0.0.221018"

  # Lifecycle Controls
  auto_minor_version_update  = true
  enable_deletion_protection = false   # Allow easy teardown in Dev/QA
  enable_stop_protection     = false
  block_until_complete       = true    # Wait for DB to be READY before finishing

  # Azure Infrastructure
  infrastructure {
    cloud        = "azure"
    region       = "eastUS"
    vpc          = "your-vpc-name"
    compute_type = "tesl_4_a"          # 4 vCPU shape
    enable_encryption    = true
    encryption_key       = "default-encryption-key"
    additional_storage   = 0
    timezone             = "Asia/Calcutta"
    enable_compute_sharing = true      # Share compute = save cost in Dev/QA
  }

  # Network & Access
  service_connectivity {
    service_port         = "1521"      # Default Oracle port
    enable_public_access = true
    enable_s_s_l         = true
    allowed_ip_addresses = [var.allowed_ip]
  }

  # Database Definition
  databases {
    database_name        = "DEVDB"
    database_description = "Dev/QA Oracle Database"

    database_configuration {
      oracle_config {}    # Add Oracle-specific params here if needed
    }
  }

  # Master Credentials
  creds {
    master_user     = "admin"
    master_password = var.db_master_password
  }

  # Backup Policy
  snapshot_configuration {
    auto_snapshot       = true
    sla                 = "PITR-1day"   # 1-day point-in-time recovery
    snapshot_start_time = "02:00"       # Backup at 2 AM
  }

  # Tags for organization
  tags { name = "environment"; value = "dev-qa" }
  tags { name = "managed-by";  value = "terraform" }
  tags { name = "team";        value = "engineering" }
}
```

---

### `outputs.tf` — What Gets Printed After Apply
```hcl
output "db_service_id"     { value = tessell_db_service.oracle_dev_qa.id }
output "db_service_name"   { value = tessell_db_service.oracle_dev_qa.name }
output "db_service_status" { value = tessell_db_service.oracle_dev_qa.status }
output "db_connect_port"   { value = "1521" }
```
> After `terraform apply` succeeds, these values are printed in your terminal — save them!

---

## Configuration Reference

| Parameter | Value Used | What It Means |
|---|---|---|
| `engine_type` | `ORACLE` | Oracle database engine |
| `edition` | `STANDARD` | Standard Edition (cheaper than Enterprise) |
| `topology` | `single_instance` | 1 node (no high availability) |
| `software_image_version` | `19.17.0.0.221018` | Oracle 19c patch level |
| `cloud` | `azure` | Microsoft Azure cloud |
| `region` | `eastUS` | Azure East US region |
| `compute_type` | `tesl_4_a` | 4 vCPU Tessell compute shape |
| `service_port` | `1521` | Standard Oracle listener port |
| `sla` | `PITR-1day` | Point-in-time recovery: 1 day window |
| `enable_compute_sharing` | `true` | Share VM with other services (cost saving) |

---

## Step-by-Step Setup

### Step 1 — Clone or Create the Project

```bash
mkdir tessell-oracle-azure && cd tessell-oracle-azure
# Create all 5 files as described in the File-by-File section above
```

### Step 2 — Add terraform.tfvars

```bash
cat > terraform.tfvars << EOF
api_address        = "https://api.tessell.com"
tenant_id          = "YOUR-TENANT-UUID"
api_key            = "YOUR-API-KEY"
allowed_ip         = "$(curl -s ifconfig.me)"
db_master_password = "MyStr0ng@Password123"
EOF
```

### Step 3 — Add to .gitignore

```bash
cat > .gitignore << EOF
terraform.tfvars
.terraform/
*.tfstate
*.tfstate.backup
.terraform.lock.hcl
EOF
```

### Step 4 — Initialize Terraform

```bash
terraform init
```

Expected output:
```
Initializing the backend...
Initializing provider plugins...
- Finding tessell-cloud/tessell versions...
- Installing tessell-cloud/tessell...

Terraform has been successfully initialized!
```

---

## Running Terraform

### Preview Changes (Dry Run — No DB Created Yet)
```bash
terraform plan
```
This shows exactly what Terraform **will** create — no actual changes made. Review it carefully.

### Provision the Database
```bash
terraform apply
```
Type `yes` when prompted.

⏳ **Provisioning takes 10–20 minutes.** Since `block_until_complete = true`, Terraform waits until Oracle is fully `READY` before finishing.

Expected final output:
```
Apply complete! Resources: 1 added, 0 changed, 0 destroyed.

Outputs:

db_connect_port   = "1521"
db_service_id     = "abc123-def456-..."
db_service_name   = "oracle-dev-qa"
db_service_status = "READY"
```

---

## Verify the Database

After `terraform apply` completes, verify in the Tessell Console:

1. Go to **Tessell Console** → **DB Services**
2. Find `oracle-dev-qa`
3. Status should show: ✅ `READY`
4. Note the **Endpoint hostname** shown in the console

---

## Connect to Oracle DB

Use **SQL*Plus**, **DBeaver**, or **SQL Developer**:

```bash
# Using SQL*Plus
sqlplus admin/MyStr0ng@Password123@<tessell-endpoint-hostname>:1521/DEVDB

# Using JDBC connection string (for your app)
jdbc:oracle:thin:@<tessell-endpoint-hostname>:1521:DEVDB
```

**Connection Details:**
| Field | Value |
|---|---|
| Host | From Tessell Console (Endpoint) |
| Port | `1521` |
| Service/SID | `DEVDB` |
| Username | `admin` |
| Password | Your `db_master_password` value |

---

## Tear Down

When you're done with the Dev/QA environment:

```bash
terraform destroy
```

Type `yes` to confirm. This will delete the Oracle DB service from Tessell/Azure.

> ⚠️ This is irreversible! All data will be deleted. Take a snapshot first if needed.

---

## Troubleshooting

| Problem | Cause | Fix |
|---|---|---|
| `Error: 401 Unauthorized` | Wrong API key | Double-check `api_key` in `terraform.tfvars` |
| `Error: VPC not found` | Wrong VPC name | Get exact name from Tessell Console → Networks |
| `Error: Invalid compute_type` | Shape name wrong | Check available shapes in Tessell Console |
| `Timeout after 20 mins` | Provisioning stuck | Check Tessell Console for error status |
| `Cannot connect on 1521` | IP not whitelisted | Verify `allowed_ip` matches `curl ifconfig.me` |
| `Provider not found` | Not initialized | Run `terraform init` first |

---

## Dev/QA vs Production Differences

| Setting | Dev/QA (This Guide) | Production |
|---|---|---|
| `topology` | `single_instance` | `ha` (High Availability) |
| `edition` | `STANDARD` | `ENTERPRISE` |
| `enable_deletion_protection` | `false` | `true` |
| `enable_stop_protection` | `false` | `true` |
| `enable_compute_sharing` | `true` | `false` |
| `sla` | `PITR-1day` | `PITR-7day` or longer |
| `enable_public_access` | `true` | `false` (private only) |

---

## Security Best Practices

- ✅ Always add `terraform.tfvars` to `.gitignore`
- ✅ Use `sensitive = true` for all password/key variables
- ✅ Whitelist only your specific IP in `allowed_ip_addresses`
- ✅ Use a strong password (min 12 chars, mixed case + numbers + symbols)
- ✅ Enable SSL (`enable_s_s_l = true`)
- ✅ For team use: store `terraform.tfstate` in a remote backend (Azure Blob or HCP Terraform)
- ❌ Never hardcode secrets directly in `main.tf` or `variables.tf`
- ❌ Never commit `.tfstate` files — they contain your DB credentials in plaintext

---

## Quick Reference Commands

```bash
terraform init       # Download Tessell provider
terraform validate   # Check .tf files for syntax errors
terraform plan       # Preview what will be created (dry run)
terraform apply      # Provision the Oracle DB
terraform output     # Show connection info after apply
terraform destroy    # Delete everything (irreversible!)
```

---

*Generated for: Oracle 19c SE2 | Azure eastUS | Dev/QA | single_instance topology*