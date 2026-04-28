# Provision Postgresql Single Instance DB service
resource "tessell_db_service" "example" {
  name                       = "finance-db"
  description                = "Database for finance department"
  subscription               = "default"
  engine_type                = "POSTGRESQL"
  topology                   = "single_instance"
  software_image             = "PostgreSQL 13"
  software_image_version     = "PostgreSQL 13.3"
  auto_minor_version_update  = true
  enable_deletion_protection = false
  infrastructure {
    cloud                  = "aws"
    enable_encryption      = true
    encryption_key         = "finance-db-encyption-key-with-salt"
    additional_storage     = 0
    timezone               = "Asia/Calcutta"
    enable_compute_sharing = false
  }
  service_connectivity {
    service_port         = "5432"
    enable_public_access = true
    allowed_ip_addresses = [
      "11.22.33.44"
    ]
  }
  creds {
    master_user     = "master"
    master_password = "MyPassword@123"
  }
  maintenance_window {
    day      = "Sunday"
    time     = "02:00"
    duration = 30
  }
  rpo_policy_config {
    enable_auto_snapshot = true
    standard_policy {
      retention_days           = 2
      include_transaction_logs = true
      snapshot_start_time {
        hour   = 19
        minute = 30
      }
    }
  }
  # For custom rpo_policy_config
  # 		rpo_policy_config {
  #   		enable_auto_snapshot = true
  #   		custom_policy {
  #   			name = "Test-policy"
  #   			schedule {
  #   				backup_start_time {
  #   					hour = 19
  #   					minute = 30
  #   				}
  #   				daily_schedule {
  #   					backups_per_day = 1
  #             #Currently support 1 only
  #   				}
  #   				weekly_schedule {
  #   					days = [
  #   						"Wednesday",
  #   					]
  #   				}
  #   				monthly_schedule {
  #   					common_schedule {
  #   						dates = [
  #   							24,
  #   						]
  #   						last_day_of_month = false
  #   					}
  #   				}
  #   				yearly_schedule {
  #   					common_schedule {
  #   						dates = [
  #   							21,
  #   						]
  #   						months = [
  #   							"May",
  #   						]
  #   						last_day_of_month = false
  #   					}
  #   				}
  #   			}
  #   		}
  #   	}
  engine_configuration {
    postgresql_config {
      parameter_profile_id = "parameter-profile-id"
    }
  }

  databases {
    database_name = "db1"
    database_configuration {
      postgresql_config {
        parameter_profile_id = "parameter-profile-id"
      }
    }
  }
  instances {
    name = "default-node-0"
    role = "primary"
    storage_config {
      provider = "AWS_EBS"
    }
    aws_infra_config {
      aws_cpu_options {
        vcpus = 2
      }
    }
    private_subnet      = "my-private-subnet"
    region              = "ap-south-1"
    instance_group_name = "default"
    availability_zone   = "ap-south-1a"
    vpc                 = "tessell-vpc-4jd48"
    compute_type        = "tesl_2h_a_p"
  }
  #  Uncomment to add new instance or in case of
  #  high_availability topology service provisioning
  #     instances {
  #       name = "default-node-1"
  #       role = "failover_replica"
  #       storage_config {
  #                provider = "AWS_EBS"
  #            }
  #       aws_infra_config {
  #                aws_cpu_options {
  #                    vcpus = 2
  #                }
  #            }
  #       private_subnet = "my-private-subnet"
  #       region = "ap-south-1"
  #       instance_group_name = "default"
  #       availability_zone = "ap-south-1b"
  #       vpc = "tessell-vpc-4jd48"
  #       compute_type = "tesl_2h_a_p"
  #     }
  #   instances {
  #       name = "default-node-2"
  #       role = "failover_replica"
  #       storage_config {
  #                provider = "AWS_EBS"
  #            }
  #       aws_infra_config {
  #                aws_cpu_options {
  #                    vcpus = 2
  #                }
  #            }
  #       private_subnet = "my-private-subnet"
  #       region = "ap-south-1"
  #       instance_group_name = "default"
  #       availability_zone = "ap-south-1b"
  #       vpc = "tessell-vpc-4jd48"
  #       compute_type = "tesl_2h_a_p"
  #     }
  tags {
    name  = "department"
    value = "finance"
  }
  tags {
    name  = "finance"
    value = ""
  }
}
# Create a clone of a Oracle DB service
resource "tessell_db_service" "example" {
  name                       = "finance-db-clone"
  description                = "Clone of finance database for QA use"
  subscription               = "default"
  engine_type                = "ORACLE"
  topology                   = "single_instance"
  software_image             = "Oracle 12c"
  software_image_version     = "12.1.0.2.0"
  auto_minor_version_update  = true
  enable_deletion_protection = false
  infrastructure {
    cloud                  = "aws"
    enable_encryption      = true
    encryption_key         = "finance-db-encyption-key-with-salt"
    additional_storage     = 0
    timezone               = "Asia/Calcutta"
    enable_compute_sharing = false
  }
  service_connectivity {
    service_port         = "1521"
    enable_public_access = true
    allowed_ip_addresses = [
      "11.22.33.44"
    ]
  }
  creds {
    master_user     = "master"
    master_password = "MyPassword@123"
  }
  rpo_policy_config {
    enable_auto_snapshot = true
    standard_policy {
      retention_days           = 2
      include_transaction_logs = true
      snapshot_start_time {
        hour   = 19
        minute = 30
      }
    }
  }
  # For custom rpo_policy_config
  # 		rpo_policy_config {
  #   		enable_auto_snapshot = true
  #   		custom_policy {
  #   			name = "Test-policy"
  #   			schedule {
  #   				backup_start_time {
  #   					hour = 19
  #   					minute = 30
  #   				}
  #   				daily_schedule {
  #   					backups_per_day = 1
  #   				}
  #   				weekly_schedule {
  #   					days = [
  #   						"Wednesday",
  #   					]
  #   				}
  #   				monthly_schedule {
  #   					common_schedule {
  #   						dates = [
  #   							24,
  #   						]
  #   						last_day_of_month = false
  #   					}
  #   				}
  #   				yearly_schedule {
  #   					common_schedule {
  #   						dates = [
  #   							21,
  #   						]
  #   						months = [
  #   							"May",
  #   						]
  #   						last_day_of_month = false
  #   					}
  #   				}
  #   			}
  #   		}
  #   	}
  engine_configuration {
    oracle_config {
      parameter_profile_id   = "parameter-profile-id"
      options_profile_id        = "options-profile-id"
      character_set          = "AL32UTF8"
      national_character_set = "AL16UTF16"
    }
  }
  databases {
    source_database_id = "14107367-fbc3-4f3d-8cc3-b5a7e5910e08"
    database_name      = "orcl"
    database_configuration {
      oracle_config {
        parameter_profile_id = "parameter-profile-id"
        options_profile_id      = "options-profile-id"
      }
    }
  }
  instances {
    name = "default-node-0"
    role = "primary"
    storage_config {
      provider = "AWS_EBS"
    }
    aws_infra_config {
      aws_cpu_options {
        vcpus = 2
      }
    }
    private_subnet      = "my-private-subnet"
    region              = "ap-south-1"
    instance_group_name = "default"
    availability_zone   = "ap-south-1a"
    vpc                 = "tessell-vpc-4jd48"
    compute_type        = "tesl_2h_a_p"
  }
  #  Uncomment to add new instance or in case of
  #  high_availability topology service provisioning
  #     instances {
  #       name = "default-node-1"
  #       role = "failover_replica"
  #       storage_config {
  #         provider = "AWS_EBS"
  #       }
  #       aws_infra_config {
  #         aws_cpu_options {
  #            vcpus = 2
  #         }
  #       }
  #       private_subnet = "my-private-subnet"
  #       region = "ap-south-1"
  #       instance_group_name = "default"
  #       availability_zone = "ap-south-1b"
  #       vpc = "tessell-vpc-4jd48"
  #       compute_type = "tesl_2h_a_p"
  #     }
  #   instances {
  #       name = "default-node-2"
  #       role = "failover_replica"
  #       storage_config {
  #         provider = "AWS_EBS"
  #       }
  #       aws_infra_config {
  #          aws_cpu_options {
  #             vcpus = 2
  #          }
  #       }
  #       private_subnet = "my-private-subnet"
  #       region = "ap-south-1"
  #       instance_group_name = "default"
  #       availability_zone = "ap-south-1b"
  #       vpc = "tessell-vpc-4jd48"
  #       compute_type = "tesl_2h_a_p"
  #     }
  tags {
    name  = "department"
    value = "finance"
  }
  tags {
    name  = "finance-qa"
    value = ""
  }
  snapshot_id = "4592803a-a8a3-4a5e-be4c-ddf1df654242"
}