# Local values for computed/derived configuration
# Helps avoid repetition and makes code more maintainable

locals {
  # Common tags applied to all resources
  common_tags = {
    environment  = var.environment
    managed_by   = "terraform"
    team         = "engineering"
    project      = "tessell-oracle-gcp"
    created_date = formatdate("YYYY-MM-DD", timestamp())
  }

  # Environment-specific settings
  is_production = var.environment == "prod"
  
  # Compute settings based on environment
  compute_config = {
    dev     = "tesl_4_a"   # 4 vCPU
    qa      = "tesl_4_a"   # 4 vCPU
    staging = "tesl_8_a"   # 8 vCPU
    prod    = "tesl_16_a"  # 16 vCPU
  }
  
  # Backup retention based on environment
  backup_sla = {
    dev     = "PITR-1day"
    qa      = "PITR-1day"
    staging = "PITR-3day"
    prod    = "PITR-7day"
  }
  
  # Database name (Oracle SID max 8 chars)
  db_name = upper(substr("${var.environment}DB", 0, 8))
  
  # Service name with environment
  service_name = "oracle-${var.environment}"
}
