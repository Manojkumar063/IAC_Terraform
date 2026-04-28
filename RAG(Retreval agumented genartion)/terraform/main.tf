provider "aws" {
  region = var.aws_region
}

# 1. Create the S3 bucket
resource "aws_s3_bucket" "rag_docs" {
  bucket = var.bucket_name
}

# 2. Block all public access (documents are private)
resource "aws_s3_bucket_public_access_block" "rag_docs" {
  bucket                  = aws_s3_bucket.rag_docs.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# 3. Enable versioning (keeps old versions of docs safe)
resource "aws_s3_bucket_versioning" "rag_docs" {
  bucket = aws_s3_bucket.rag_docs.id
  versioning_configuration {
    status = "Enabled"
  }
}

# 4. Upload all documents from local folder to S3
locals {
  documents = [
    "ai_history.txt",
    "aws_services.txt",
    "cloud_computing.txt",
    "databases.txt",
    "docker_kubernetes.txt",
    "sample.txt"
  ]
}

resource "aws_s3_object" "docs" {
  for_each     = toset(local.documents)
  bucket       = aws_s3_bucket.rag_docs.id
  key          = "documents/${each.value}"
  source       = "../documents/${each.value}"
  content_type = "text/plain"
  etag         = filemd5("../documents/${each.value}")
}
