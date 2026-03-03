output "db_service_id" {
  description = "Unique ID of the provisioned Oracle DB service"
  value       = tessell_db_service.oracle_dev_qa.id
}

output "db_service_name" {
  description = "Name of the DB service"
  value       = tessell_db_service.oracle_dev_qa.name
}

output "db_service_status" {
  description = "Current status of the DB service (should be READY)"
  value       = tessell_db_service.oracle_dev_qa.status
}

output "database_name" {
  description = "Oracle database/SID name"
  value       = upper("${var.environment}DB")
}

output "db_connect_port" {
  description = "Oracle connection port"
  value       = "1521"
}

output "master_username" {
  description = "Database master username"
  value       = "admin"
}

output "connection_instructions" {
  description = "How to connect to the database"
  value       = <<-EOT
    
    ═══════════════════════════════════════════════════════════════
    DATABASE CONNECTION INFORMATION
    ═══════════════════════════════════════════════════════════════
    
    1. Get the endpoint from Tessell Console:
       → DB Services → ${tessell_db_service.oracle_dev_qa.name} → Endpoint
    
    2. Connect using SQL*Plus:
       sqlplus admin/<password>@<endpoint>:1521/${upper("${var.environment}DB")}
    
    3. JDBC Connection String:
       jdbc:oracle:thin:@<endpoint>:1521:${upper("${var.environment}DB")}
    
    4. Connection Details:
       Host:     <from Tessell Console>
       Port:     1521
       SID:      ${upper("${var.environment}DB")}
       Username: admin
       Password: <your db_master_password>
    
    ═══════════════════════════════════════════════════════════════
  EOT
}

output "environment_config" {
  description = "Environment-specific configuration summary"
  value = {
    environment           = var.environment
    region                = var.aws_region
    topology              = "single_instance"
    deletion_protection   = var.environment == "prod" ? true : false
    public_access         = var.environment != "prod" ? true : false
    compute_sharing       = var.environment != "prod" ? true : false
    backup_retention      = var.environment == "prod" ? "7 days" : "1 day"
  }
}

output "next_steps" {
  description = "What to do after provisioning"
  value       = <<-EOT
    
    ✅ Database provisioned successfully!
    
    Next Steps:
    1. Wait 2-3 minutes for DNS propagation
    2. Get endpoint: Tessell Console → DB Services → ${tessell_db_service.oracle_dev_qa.name}
    3. Test connection: sqlplus admin/<password>@<endpoint>:1521/${upper("${var.environment}DB")}
    4. Verify your IP is whitelisted: ${var.allowed_ip}
    
    To destroy: terraform destroy
  EOT
}