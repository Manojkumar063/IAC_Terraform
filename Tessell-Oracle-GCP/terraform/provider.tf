terraform {
  required_providers {
    tessell = {
      source = "tessell-cloud/tessell"
    }
  }
}

provider "tessell" {
  api_address = var.api_address
  tenant_id   = var.tenant_id
  api_key     = var.api_key
}
