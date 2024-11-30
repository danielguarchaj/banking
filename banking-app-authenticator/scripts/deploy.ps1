# Variables
$FunctionName = "banking-app-authenticator"
$BucketName = "albedo-codepipeline-artifacts"
$ZipFile = "banking-app-authenticator-codebase.zip"

# Create zip file of the Lambda function code
Compress-Archive -Path * -DestinationPath $ZipFile

# Upload the zip file to S3
aws s3 cp $ZipFile "s3://$BucketName/$ZipFile"

# Update the Lambda function to use the new code from S3
aws lambda update-function-code --function-name $FunctionName --s3-bucket $BucketName --s3-key $ZipFile

# Cleanup the local zip file
Remove-Item $ZipFile

Write-Output "Deployment complete."