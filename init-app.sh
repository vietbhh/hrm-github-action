
#!/bin/bash
printf "Initialing app env...\n"
HOST=$1
APP_PORT=$2
PHP_PORT=$3
NODE_PORT=$4
DB_NAME=$5
cp env .env
sed -i 's/^APP_HOST.*/APP_HOST="'"$HOST"'"/' .env
sed -i 's/^APP_PORT.*/APP_PORT="'"$APP_PORT"'"/' .env
sed -i 's/^PHP_API_HOST.*/PHP_API_HOST="'"$HOST"'"/' .env
sed -i 's/^PHP_API_PORT.*/PHP_API_PORT="'"$PHP_PORT"'"/' .env
sed -i 's/^NODE_API_HOST.*/NODE_API_HOST="'"$HOST"'"/' .env
sed -i 's/^NODE_API_PORT.*/NODE_API_PORT="'"$NODE_PORT"'"/' .env
sed -i 's/^MYSQL_DATABASE.*/MYSQL_DATABASE="'"$DB_NAME"'"/' .env
sed -i 's/^MONGO_DATABASE.*/MONGO_DATABASE="'"$DB_NAME"'"/' .env
sed -i 's/^FIRESTORE_DB.*/FIRESTORE_DB="'"$DB_NAME"'"/' .env
chmod +x init-env.sh
chmod +x remove-all-dep.sh