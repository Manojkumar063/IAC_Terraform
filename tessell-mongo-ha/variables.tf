variable "tenant_id" {}
variable "api_key" {
  sensitive = true
}
variable "db_password" {
  sensitive = true
}
variable "vpc_name" {
  description = "Existing AWS VPC name registered in Tessell"
}