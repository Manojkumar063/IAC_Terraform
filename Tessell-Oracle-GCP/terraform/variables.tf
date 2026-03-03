variable "api_address" {
  type        = string
  description = "Tessell API endpoint URL"
  default     = "https://api.tessell.com"
}

variable "tenant_id" {
  type        = string
  description = "Your Tessell Tenant UUID"
  
  validation {
    condition     = can(regex("^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$", var.tenant_id))
    error_message = "tenant_id must be a valid UUID format"
  }
}

variable "api_key" {
  type        = string
  sensitive   = true
  description = "Tessell API Key (never commit this!)"
  
  validation {
    condition     = length(var.api_key) > 10
    error_message = "api_key appears invalid (too short)"
  }
}

variable "allowed_ip" {
  type        = string
  description = "Your machine IP to allow DB access (run: curl ifconfig.me)"
  
  validation {
    condition     = can(regex("^([0-9]{1,3}\\.){3}[0-9]{1,3}$", var.allowed_ip))
    error_message = "allowed_ip must be a valid IPv4 address (e.g., 103.45.12.200)"
  }
}

variable "db_master_password" {
  type        = string
  sensitive   = true
  description = "Oracle master user password (min 12 chars, must include uppercase, lowercase, number, special char)"
  
  validation {
    condition     = length(var.db_master_password) >= 12
    error_message = "db_master_password must be at least 12 characters long"
  }
  
  validation {
    condition     = can(regex("[A-Z]", var.db_master_password)) && can(regex("[a-z]", var.db_master_password)) && can(regex("[0-9]", var.db_master_password)) && can(regex("[^A-Za-z0-9]", var.db_master_password))
    error_message = "db_master_password must contain uppercase, lowercase, number, and special character"
  }
}

# Optional: Environment variable for multi-environment support
variable "environment" {
  type        = string
  description = "Environment name (dev, qa, staging, prod)"
  default     = "dev"
  
  validation {
    condition     = contains(["dev", "qa", "staging", "prod"], var.environment)
    error_message = "environment must be one of: dev, qa, staging, prod"
  }
}

# Optional: VPC name as variable for flexibility
variable "vpc_name" {
  type        = string
  description = "Tessell VPC name from Tessell Console"
  default     = "your-vpc-name"
}

# Optional: GCP region as variable
variable "gcp_region" {
  type        = string
  description = "GCP region for database deployment"
  default     = "us-central1"
}
