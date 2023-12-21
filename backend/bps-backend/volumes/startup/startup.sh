cp -a /secrets/. /etc/letsencrypt/
echo The secrets have been imported

(
    sleep 5m
    while :; do
        chmod -R 777 /etc/letsencrypt/ /secrets/
        cp -r -L /etc/letsencrypt/. /secrets/
	echo The secrets have been exported
        sleep 8d
    done
) &

echo Starting the nginx-certbot service
/scripts/start_nginx_certbot.sh

