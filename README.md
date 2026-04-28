# IAC_Terraform

Infrastructure as Code (IaC) using Terraform to provision and manage cloud database infrastructure across AWS, Azure, and GCP.

---

## Modules

### 1. `postgre-sql-AWS-RDS`
Provisions a **PostgreSQL RDS instance** on AWS. Includes deploy and destroy scripts for quick setup and teardown.

### 2. `tessell-mongo-ha`
Sets up a **MongoDB High Availability** cluster using Tessell on AWS.

### 3. `Tessell-Oracle-AWS`
Deploys an **Oracle database** on AWS using the Tessell platform.

### 4. `Tessell-Oracle-Azure`
Deploys an **Oracle database** on Azure using the Tessell platform.

### 5. `Tessell-Oracle-GCP`
Deploys an **Oracle database** on GCP using the Tessell platform.

---

## Prerequisites

- [Terraform](https://developer.hashicorp.com/terraform/downloads) >= 1.0
- AWS / Azure / GCP credentials configured
- Cloud provider CLI tools (aws-cli, az-cli, gcloud)

---

## Usage

```bash
cd <module-folder>/terraform
terraform init
terraform plan
terraform apply
```

To destroy:
```bash
terraform destroy
```

---

## Notes

- Copy `terraform.tfvars.example` to `terraform.tfvars` and fill in your values before running.
- Never commit `terraform.tfvars` with sensitive credentials — it is excluded via `.gitignore`.
