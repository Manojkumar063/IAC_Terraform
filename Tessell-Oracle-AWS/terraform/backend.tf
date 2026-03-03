# Remote State Backend Configuration
# Uncomment and configure this for team collaboration
# This stores terraform.tfstate in AWS S3 instead of locally

# terraform {
#   backend "s3" {
#     bucket         = "terraform-state-bucket"
#     key            = "tessell-oracle.tfstate"
#     region         = "us-east-1"
#     encrypt        = true
#     dynamodb_table = "terraform-state-lock"
#   }
# }

# To set up AWS backend:
# 1. Create S3 bucket:
#    aws s3 mb s3://terraform-state-bucket --region us-east-1
#
# 2. Enable versioning:
#    aws s3api put-bucket-versioning --bucket terraform-state-bucket --versioning-configuration Status=Enabled
#
# 3. Create DynamoDB table for state locking:
#    aws dynamodb create-table --table-name terraform-state-lock --attribute-definitions AttributeName=LockID,AttributeType=S --key-schema AttributeName=LockID,KeyType=HASH --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5
#
# 4. Uncomment the backend block above and run:
#    terraform init -migrate-state
