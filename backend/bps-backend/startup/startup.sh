echo Waiting a minute for the DNS record to be created...
sleep 1m

cp -a /secrets/. /etc/letsencrypt/
echo Copied the secrets from the volume

(
    sleep 5m
    while :; do
        chmod -R 777 /etc/letsencrypt/ /secrets/
        cp -r -L /etc/letsencrypt/. /secrets/
        echo Copied the secrets to the volume
        sleep 8d
    done
) &

echo Starting the nginx-certbot service
/scripts/start_nginx_certbot.sh
