output "bucket_name" {
  value = aws_s3_bucket.rag_docs.bucket
}

output "bucket_arn" {
  value = aws_s3_bucket.rag_docs.arn
}

output "documents_uploaded" {
  value = [for obj in aws_s3_object.docs : obj.key]
}
