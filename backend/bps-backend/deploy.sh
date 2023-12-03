# Use the Azure Container Instances context
docker context use bps-backend

# Spin up the Container Group
docker compose up

# Get the IP address of the Container Group
ip=$(az container show --resource-group vrepetskyi --name bps-backend --query ipAddress.ip --output tsv)

change_batch=$(
    cat <<EOF
{
  "Changes": [
    {
      "Action": "UPSERT",
      "ResourceRecordSet": {
        "Name": "api.plots.vrepetskyi.codes",
        "Type": "A",
        "TTL": 300,
        "ResourceRecords": [
          {
            "Value": "$ip"
          }
        ]
      }
    }
  ]
}
EOF
)

# Point the DNS record in AWS Route 53 to the Container Group
aws route53 change-resource-record-sets --hosted-zone-id Z05843003M6JMQBW9E9I6 --change-batch "$change_batch"
