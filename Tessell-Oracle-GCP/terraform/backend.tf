# Remote State Backend Configuration
# Uncomment and configure this for team collaboration
# This stores terraform.tfstate in GCS instead of locally

# terraform {
#   backend "gcs" {
#     bucket  = "terraform-state-bucket"
#     prefix  = "tessell-oracle"
#   }
# }

# To set up GCS backend:
# 1. Create GCS bucket:
#    gcloud storage buckets create gs://terraform-state-bucket --location=us-central1
#
# 2. Enable versioning:
#    gcloud storage buckets update gs://terraform-state-bucket --versioning
#
# 3. Uncomment the backend block above and run:
#    terraform init -migrate-state
