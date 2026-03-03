# ⚡ Quick Start Guide — Tessell Oracle on GCP

Get your Oracle 19c database running on GCP in 5 minutes.

## Prerequisites

- Terraform installed
- Tessell account with API key
- Your public IP address

## Step 1: Get Tessell Credentials

1. Login to Tessell Console
2. Go to **Settings** → Copy your **Tenant ID**
3. Go to **Profile** → **API Keys** → Create new key

## Step 2: Configure Variables

```bash
cd terraform
cp terraform.tfvars.example terraform.tfvars
```

Edit `terraform.tfvars`:
```hcl
tenant_id          = "your-tenant-uuid-here"
api_key            = "your-api-key-here"
allowed_ip         = "your-ip-here"  # Run: curl ifconfig.me
db_master_password = "SecurePass123!"
```

## Step 3: Deploy

```bash
terraform init
terraform plan
terraform apply
```

Type `yes` when prompted. Wait 5-10 minutes.

## Step 4: Connect

Get endpoint from Tessell Console, then:

```bash
sqlplus admin/SecurePass123!@<endpoint>:1521/DEVDB
```

## Step 5: Cleanup

```bash
terraform destroy
```

---

**Need help?** Check [docs/README.md](README.md) for detailed documentation.
