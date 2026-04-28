terraform {
  required_providers {
    tessell = {
      source  = "tessell/tessell"
      version = ">= 1.0.0"
    }
  }
}

provider "tessell" {
  api_address = "https://api.tessell.com"
  tenant_id   = var.tenant_id
  api_key     = var.api_key
}

resource "tessell_db_service" "mongo_ha" {

  name         = "mongo-ha-prod"
  subscription = "default"

  engine_type  = "MONGODB"
  topology     = "replica_set"   # 🔥 HA enabled

  software_image         = "MongoDB 6.0"
  software_image_version = "6.0"

  block_until_complete = true

  infrastructure {
    cloud             = "aws"
    region            = "us-east-1"
    vpc               = var.vpc_name
    compute_type      = "tesl_4_a"
    enable_encryption = true
  }
  
  backup_configuration {
    backup_retention_period = 7
    backup_window_start_time = "02:00"
    backup_window_end_time   = "06:00"
    enable_backup            = true
  }

  # 👇 Replica Set configuration
  replica_set_configuration {
    replica_set_name = "rs0"
  }
  
  # 👇 Cluster configuration
  cluster_configuration {
    node_count = 3
  }
  
  service_connectivity {
    service_port         = "27017"
    enable_public_access = false      # 🔒 Private only
    enable_s_s_l         = true
    allowed_ip_addresses = []
  }
  # Number of nodes in replica set
  cluster_configuration {
    node_count = 3
    terraform  ={
    lifecycle {
      ignore_changes = [
        cluster_configuration[0].node_count,
      ]
    }
  }
  

  service_connectivity {
    service_port         = "27017"
    enable_public_access = false      # 🔒 Private only
    enable_s_s_l         = true
    allowed_ip_addresses = []
  }

  databases {
    database_name = "prod_db"
  }

  creds {
    master_user     = "mongoadmin"
    master_password = var.db_password
  }

  snapshot_configuration {
    auto_snapshot = true
    sla           = "PITR-7day"
    snapshot_start_time = "02:00"
  }

  tags = {
    environment = "production"
    type        = "mongodb-ha"
    owner       = "platform-engineering"
    cost_center   = "12345"
    project       = "data-platform"
    managed_by    = "terraform"
    business_unit = "engineering"
    application   = "backend-api"
    contact       = "platform-team@company.com"
    expiry_date   = "2024-12-31"
    department    = "data-engineering"
    region        = "us-east-1"
    compliance     = "pci-dss"
    data_classification = "sensitive"
  }
}
