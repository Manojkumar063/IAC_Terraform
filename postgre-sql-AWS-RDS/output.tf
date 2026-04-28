output "db_endpoint" {
  value = aws_db_instance.postgres_db.endpoint
}

output "db_port" {
  value = aws_db_instance.postgres_db.port
}