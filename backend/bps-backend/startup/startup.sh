sleep 1m

cp -a /secrets/. /etc/letsencrypt/

(
    sleep 5m
    while :; do
        chmod -R 777 /etc/letsencrypt/ /secrets/
        cp -r -L /etc/letsencrypt/. /secrets/
        sleep 8d
    done
) &

/scripts/start_nginx_certbot.sh
