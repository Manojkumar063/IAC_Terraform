output "mongo_ha_endpoint" {
  value = tessell_db_service.mongo_ha.service_connectivity[0].endpoint
}

output "mongo_ha_port" {
  value = tessell_db_service.mongo_ha.service_connectivity[0].service_port
}