### Deployment to Azure Container Instances

The API is wrapped with [docker-nginx-certbot](https://github.com/JonasAlfredsson/docker-nginx-certbot/), which manages the SSL certificates and redirects all the requests to HTTPS.

- Set environment variables in `secrets.env` (see `example.env`)
- Create a Storage Account and File Shares in accordance to the compose file
- Upload the startup script
- Upload the [NGINX server configuration](https://github.com/JonasAlfredsson/docker-nginx-certbot/blob/master/docs/good_to_know.md#how-the-script-add-domain-names-to-certificate-requests)

```bash
# Login to Azure
az login --use-device-code

# Setup Azure Container Registry
az acr login --name vrepetskyi

# Integrate Azure with Docker
docker login azure

# Login to AWS
aws configure

# Initiate automated deployment
./deploy.sh
```

Useful commands:

```bash
# Examine standard output of a container
az container attach -g vrepetskyi -n bps-backend --container <container-name>

# Connect to a container
az container exec -g vrepetskyi -n bps-backend --container <container-name> --exec-command /bin/bash
```
