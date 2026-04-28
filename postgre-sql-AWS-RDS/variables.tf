variable "aws_region" {
  default = "us-east-1"
}

variable "db_username" {
  description = "Database master username"
}

variable "db_password" {
  description = "Database master password"
  sensitive   = true
}