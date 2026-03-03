resource "tessell_db_service" "oracle_dev_qa" {

  # ─── Basic Info ───────────────────────────────────────────────
  name        = "oracle-${var.environment}"
  description = "Oracle 19c ${upper(var.environment)} DB on GCP - Provisioned via Terraform"

  # ─── Tessell Subscription ─────────────────────────────────────
  subscription = "default"               # Replace with your Tessell subscription name

  # ─── Engine Config ────────────────────────────────────────────
  engine_type            = "ORACLE"
  edition                = "STANDARD"    # Dev/QA → STANDARD (cheaper). Use ENTERPRISE for prod.
  topology               = "single_instance"    # Dev/QA doesn't need HA
  software_image         = "Oracle 19c SE2"
  software_image_version = "19.17.0.0.221018"

  # ─── Lifecycle Settings ───────────────────────────────────────
  auto_minor_version_update  = true      # Auto-patch minor versions
  enable_deletion_protection = var.environment == "prod" ? true : false  # Protect prod from accidental deletion
  enable_stop_protection     = var.environment == "prod" ? true : false  # Protect prod from accidental stop
  block_until_complete       = true      # Wait for DB READY before Terraform finishes

  # ─── Infrastructure (GCP) ─────────────────────────────────────
  infrastructure {
    cloud             = "gcp"
    region            = var.gcp_region
    availability_zone = null              # Single instance: set null
    vpc               = var.vpc_name

    compute_type      = "tesl_4_a"        # 4 vCPU shape — good for Dev/QA
    enable_encryption = true
    encryption_key    = "default-encryption-key"
    additional_storage = 0               # No extra storage for Dev/QA

    timezone                = "Asia/Calcutta"   # Set your timezone
    enable_compute_sharing  = var.environment != "prod"  # Only share compute in non-prod
  }

  # ─── Network Connectivity ─────────────────────────────────────
  service_connectivity {
    service_port        = "1521"           # Oracle default port
    enable_public_access = var.environment != "prod"  # Only allow public access in non-prod
    enable_s_s_l         = true

    allowed_ip_addresses = [
      var.allowed_ip                       # Only your IP can connect
    ]
  }

  # ─── Database Inside the Service ──────────────────────────────
  databases {
    database_name        = upper("${var.environment}DB")  # DEVDB, QADB, PRODDB
    database_description = "${upper(var.environment)} Oracle Database"

    database_configuration {
      oracle_config {
        # Add Oracle-specific params here if needed
        # e.g., character_set = "AL32UTF8"
      }
    }
  }

  # ─── Master Credentials ───────────────────────────────────────
  creds {
    master_user     = "admin"
    master_password = var.db_master_password
  }

  # ─── Backup / Snapshot Policy ─────────────────────────────────
  snapshot_configuration {
    auto_snapshot       = true
    sla                 = var.environment == "prod" ? "PITR-7day" : "PITR-1day"
    snapshot_start_time = "02:00"        # Backup at 2 AM
  }

  # ─── Tags ─────────────────────────────────────────────────────
  tags {
    name  = "environment"
    value = var.environment
  }

  tags {
    name  = "team"
    value = "engineering"
  }

  tags {
    name  = "managed-by"
    value = "terraform"
  }
  
  tags {
    name  = "created-date"
    value = timestamp()
  }

  # ─── Lifecycle Rules ──────────────────────────────────────────
  lifecycle {
    # Prevent accidental deletion in production
    prevent_destroy = var.environment == "prod" ? true : false
    
    # Ignore changes to tags that might be modified externally
    ignore_changes = [
      tags
    ]
  }
}
