
#!/bin/bash
printf "Initialing app env...\n"
HOST=$1
APP_PORT=$2
PHP_PORT=$3
NODE_PORT=$4
cp env .env
sed -i 's/^APP_HOST.*/APP_HOST="'"$HOST"'"/' .env
sed -i 's/^APP_PORT.*/APP_PORT="'"$APP_PORT"'"/' .env
sed -i 's/^PHP_API_HOST.*/PHP_API_HOST="'"$HOST"'"/' .env
sed -i 's/^PHP_API_PORT.*/PHP_API_PORT="'"$PHP_PORT"'"/' .env
sed -i 's/^NODE_API_HOST.*/NODE_API_HOST="'"$HOST"'"/' .env
sed -i 's/^NODE_API_PORT.*/NODE_API_PORT="'"$NODE_PORT"'"/' .env
chmod +x init-env.sh
chmod +x remove-all-dep.sh