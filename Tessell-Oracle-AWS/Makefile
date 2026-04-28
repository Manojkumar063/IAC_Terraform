.PHONY: help init validate plan apply destroy clean fmt check

help: ## Show this help message
	@echo "Tessell Oracle AWS - Terraform Commands"
	@echo "=========================================="
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\\033[36m%-15s\\033[0m %s\\n", $$1, $$2}'

init: ## Initialize Terraform (download providers)
	cd terraform && terraform init

validate: ## Validate Terraform configuration
	cd terraform && terraform validate

fmt: ## Format Terraform files
	cd terraform && terraform fmt -recursive

plan: ## Show what will be created (dry run)
	cd terraform && terraform plan

apply: ## Create the database (requires confirmation)
	cd terraform && terraform apply

apply-auto: ## Create the database (auto-approve, use with caution!)
	cd terraform && terraform apply -auto-approve

destroy: ## Delete the database (requires confirmation)
	cd terraform && terraform destroy

destroy-auto: ## Delete the database (auto-approve, use with caution!)
	cd terraform && terraform destroy -auto-approve

output: ## Show outputs from last apply
	cd terraform && terraform output

clean: ## Clean Terraform cache and state backups
	cd terraform && rm -rf .terraform/ && rm -f .terraform.lock.hcl && rm -f terraform.tfstate.backup

check: fmt validate ## Format and validate code

setup: ## First-time setup (copy example tfvars)
	@if [ ! -f terraform/terraform.tfvars ]; then \
		cp terraform/terraform.tfvars.example terraform/terraform.tfvars; \
		echo "✅ Created terraform/terraform.tfvars from example"; \
		echo "⚠️  Edit terraform/terraform.tfvars with your actual values!"; \
	else \
		echo "⚠️  terraform/terraform.tfvars already exists"; \
	fi
 