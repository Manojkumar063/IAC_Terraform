# AWS vs Azure Configuration Differences

This document highlights the key differences between the Tessell-Oracle-Azure and Tessell-Oracle-AWS Terraform configurations.

## Key Changes Made

### 1. Cloud Provider Configuration
**Azure Version:**
```hcl
infrastructure {
  cloud  = "azure"
  region = "eastUS"
  ...
}
```

**AWS Version:**
```hcl
infrastructure {
  cloud  = "aws"
  region = "us-east-1"
  ...
}
```

### 2. Variable Names
**Azure Version:**
- `azure_region` (default: "eastUS")

**AWS Version:**
- `aws_region` (default: "us-east-1")

### 3. Backend Configuration
**Azure Version:**
```hcl
backend "azurerm" {
  resource_group_name  = "terraform-state-rg"
  storage_account_name = "tfstatexxxxx"
  container_name       = "tfstate"
  key                  = "tessell-oracle.tfstate"
}
```

**AWS Version:**
```hcl
backend "s3" {
  bucket         = "terraform-state-bucket"
  key            = "tessell-oracle.tfstate"
  region         = "us-east-1"
  encrypt        = true
  dynamodb_table = "terraform-state-lock"
}
```

### 4. Documentation Updates
All documentation files have been updated to reference:
- AWS instead of Azure
- AWS regions (us-east-1) instead of Azure regions (eastUS)
- S3 backend instead of Azure Blob Storage
- AWS-specific setup instructions

## Files That Are Identical
The following files are cloud-agnostic and remain the same:
- `docs/terraform.html` - Terraform concepts documentation
- `docs/terraformm.html` - Additional Terraform learning materials
- `.gitignore` - Git ignore patterns
- `Makefile` - Build commands (except title)

## Files Modified for AWS
- `terraform/main.tf` - Changed cloud provider to "aws" and region
- `terraform/variables.tf` - Changed azure_region to aws_region
- `terraform/terraform.tfvars` - Changed region variable name
- `terraform/terraform.tfvars.example` - Updated example values
- `terraform/backend.tf` - Changed from Azure Blob to S3
- `terraform/locals.tf` - Updated project name to tessell-oracle-aws
- `docs/README.md` - Updated all Azure references to AWS
- `docs/QUICKSTART.md` - Updated cloud provider references
- `README.md` - Updated project description

## Usage

Both projects work identically from a Terraform perspective:

```bash
# Azure
cd Tessell-Oracle-Azure/terraform
terraform init
terraform apply

# AWS
cd Tessell-Oracle-AWS/terraform
terraform init
terraform apply
```

The only difference is the cloud provider where the Oracle database will be provisioned.
