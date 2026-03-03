# Remote State Backend Configuration
# Uncomment and configure this for team collaboration
# This stores terraform.tfstate in Azure Blob Storage instead of locally

# terraform {
#   backend "azurerm" {
#     resource_group_name  = "terraform-state-rg"
#     storage_account_name = "tfstatexxxxx"  # Must be globally unique
#     container_name       = "tfstate"
#     key                  = "tessell-oracle.tfstate"
#   }
# }

# To set up Azure backend:
# 1. Create resource group:
#    az group create --name terraform-state-rg --location eastus
#
# 2. Create storage account:
#    az storage account create --name tfstatexxxxx --resource-group terraform-state-rg --location eastus --sku Standard_LRS
#
# 3. Create container:
#    az storage container create --name tfstate --account-name tfstatexxxxx
#
# 4. Uncomment the backend block above and run:
#    terraform init -migrate-state
