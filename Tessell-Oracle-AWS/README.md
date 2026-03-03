# 🗄️ Tessell Oracle DB on AWS — Terraform Project

Automated provisioning of Oracle 19c database on AWS using Tessell DBaaS and Terraform.

## 📁 Project Structure

```
tessell-oracle-aws/
│
├── terraform/              # Terraform configuration files
│   ├── main.tf            # Oracle DB resource definition
│   ├── variables.tf       # Input variable declarations
│   ├── outputs.tf         # Output values after provisioning
│   ├── provider.tf        # Tessell provider configuration
│   ├── backend.tf         # Remote state backend (optional)
│   ├── locals.tf          # Local computed values
│   ├── terraform.tfvars.example  # Template for secrets
│   └── terraform.tfvars   # Actual secrets (git-ignored)
│
├── docs/                  # Documentation
│   ├── README.md          # Detailed guide
│   ├── QUICKSTART.md      # Quick start guide
│   ├── terraform.html     # Terraform concepts (educational)
│   └── terraformm.html    # Additional learning materials
│
├── examples/              # Example configurations (future use)
│
├── .gitignore            # Git ignore rules
└── Makefile              # Simplified commands

```

## 🚀 Quick Start

### 1. Setup
```bash
cd terraform
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars with your Tessell credentials
```

### 2. Deploy
```bash
terraform init
terraform plan
terraform apply
```

### 3. Connect
```bash
# Get endpoint from Tessell Console
sqlplus admin/<password>@<endpoint>:1521/DEVDB
```

## 📚 Documentation

- **[Quick Start Guide](docs/QUICKSTART.md)** — Get started in 5 minutes
- **[Detailed Guide](docs/README.md)** — Complete documentation with architecture, troubleshooting, and best practices
- **[Terraform Concepts](docs/terraform.html)** — Learn Terraform fundamentals

## 🛠️ Common Commands

```bash
# Using Makefile (from root directory)
make init      # Initialize Terraform
make plan      # Preview changes
make apply     # Create database
make destroy   # Delete database

# Using Terraform directly (from terraform/ directory)
cd terraform
terraform init
terraform plan
terraform apply
terraform destroy
```

## 🔐 Security

- ✅ `terraform.tfvars` is git-ignored (contains secrets)
- ✅ Passwords are marked sensitive
- ✅ IP whitelisting enabled
- ✅ SSL/TLS encryption enabled

## 📋 Prerequisites

- Terraform >= 1.0
- Tessell account with API key
- AWS subscription (managed by Tessell)

## 🌍 Multi-Environment Support

```bash
cd terraform
terraform apply -var="environment=dev"    # Development
terraform apply -var="environment=qa"     # QA
terraform apply -var="environment=prod"   # Production
```

## 📞 Support

- Tessell Docs: https://docs.tessell.com
- Terraform Provider: https://registry.terraform.io/providers/tessell-cloud/tessell
- Issues: Create an issue in this repository

---

**License:** MIT  
**Maintained by:** Engineering Team
