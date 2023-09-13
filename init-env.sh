source $(dirname $0)/.env
APP_URL=$HOST_PROTOCOL":\/\/"$APP_HOST":"$APP_PORT
PHP_API_URL=$HOST_PROTOCOL":\/\/"$PHP_API_HOST":"$PHP_API_PORT
NODE_API_URL=$HOST_PROTOCOL":\/\/"$NODE_API_HOST":"$NODE_API_PORT

MONGO_DB_PASSWORD_ENCODE=$MONGO_PASSWORD
MONGO_DB_PASSWORD_ENCODE=$(echo "$MONGO_DB_PASSWORD_ENCODE" | sed 's/%/%25/g')
MONGO_DB_PASSWORD_ENCODE=$(echo "$MONGO_DB_PASSWORD_ENCODE" | sed 's/@/%40/g')
MONGO_DB_PASSWORD_ENCODE=$(echo "$MONGO_DB_PASSWORD_ENCODE" | sed 's/ /%20/g')
MONGO_DB_PASSWORD_ENCODE=$(echo "$MONGO_DB_PASSWORD_ENCODE" | sed 's/!/%21/g')
MONGO_DB_PASSWORD_ENCODE=$(echo "$MONGO_DB_PASSWORD_ENCODE" | sed 's/"/%22/g')
MONGO_DB_PASSWORD_ENCODE=$(echo "$MONGO_DB_PASSWORD_ENCODE" | sed 's/#/%23/g')
MONGO_DB_PASSWORD_ENCODE=$(echo "$MONGO_DB_PASSWORD_ENCODE" | sed 's/\$/%24/g')
MONGO_DB_PASSWORD_ENCODE=$(echo "$MONGO_DB_PASSWORD_ENCODE" | sed 's/\&/%26/g')
MONGO_DB_PASSWORD_ENCODE=$(echo "$MONGO_DB_PASSWORD_ENCODE" | sed 's/'\''/%27/g')
MONGO_DB_PASSWORD_ENCODE=$(echo "$MONGO_DB_PASSWORD_ENCODE" | sed 's/(/%28/g')
MONGO_DB_PASSWORD_ENCODE=$(echo "$MONGO_DB_PASSWORD_ENCODE" | sed 's/)/%29/g')
MONGO_DB_PASSWORD_ENCODE=$(echo "$MONGO_DB_PASSWORD_ENCODE" | sed 's/\*/%2a/g')
MONGO_DB_PASSWORD_ENCODE=$(echo "$MONGO_DB_PASSWORD_ENCODE" | sed 's/+/%2b/g')
MONGO_DB_PASSWORD_ENCODE=$(echo "$MONGO_DB_PASSWORD_ENCODE" | sed 's/,/%2c/g')
MONGO_DB_PASSWORD_ENCODE=$(echo "$MONGO_DB_PASSWORD_ENCODE" | sed 's/-/%2d/g')
MONGO_DB_PASSWORD_ENCODE=$(echo "$MONGO_DB_PASSWORD_ENCODE" | sed 's/\./%2e/g')
MONGO_DB_PASSWORD_ENCODE=$(echo "$MONGO_DB_PASSWORD_ENCODE" | sed 's/\//%2f/g')
MONGO_DB_PASSWORD_ENCODE=$(echo "$MONGO_DB_PASSWORD_ENCODE" | sed 's/:/%3a/g')
MONGO_DB_PASSWORD_ENCODE=$(echo "$MONGO_DB_PASSWORD_ENCODE" | sed 's/;/%3b/g')
MONGO_DB_PASSWORD_ENCODE=$(echo "$MONGO_DB_PASSWORD_ENCODE" | sed 's/?/%3f/g')
MONGO_DB_PASSWORD_ENCODE=$(echo "$MONGO_DB_PASSWORD_ENCODE" | sed 's/\[/%5b/g')
MONGO_DB_PASSWORD_ENCODE=$(echo "$MONGO_DB_PASSWORD_ENCODE" | sed 's/\\/%5c/g')
MONGO_DB_PASSWORD_ENCODE=$(echo "$MONGO_DB_PASSWORD_ENCODE" | sed 's/\]/%5d/g')
MONGO_DB_PASSWORD_ENCODE=$(echo "$MONGO_DB_PASSWORD_ENCODE" | sed 's/\^/%5e/g')
MONGO_DB_PASSWORD_ENCODE=$(echo "$MONGO_DB_PASSWORD_ENCODE" | sed 's/_/%5f/g')
MONGO_DB_PASSWORD_ENCODE=$(echo "$MONGO_DB_PASSWORD_ENCODE" | sed 's/`/%60/g')
MONGO_DB_PASSWORD_ENCODE=$(echo "$MONGO_DB_PASSWORD_ENCODE" | sed 's/{/%7b/g')
MONGO_DB_PASSWORD_ENCODE=$(echo "$MONGO_DB_PASSWORD_ENCODE" | sed 's/|/%7c/g')
MONGO_DB_PASSWORD_ENCODE=$(echo "$MONGO_DB_PASSWORD_ENCODE" | sed 's/}/%7d/g')
MONGO_DB_PASSWORD_ENCODE=$(echo "$MONGO_DB_PASSWORD_ENCODE" | sed 's/~/%7e/g')

MONGO_DB_URI="mongodb:\/\/"$MONGO_USERNAME":"$MONGO_DB_PASSWORD_ENCODE"@"$MONGO_HOST":"$MONGO_PORT"\/"$MONGO_DATABASE"?authSource=admin"

printf "Setup env Backend/core...\n"
cp Backend/core/env Backend/core/.env
printf "Done setup env file in Backend/core/.env...\n"
printf "Setup env Backend...\n"
cp Backend/applications/default/env Backend/applications/default/.env
sed -i 's/.*database.default.hostname.*/database.default.hostname = '"$MYSQL_HOST"'/' Backend/applications/default/.env
sed -i 's/.*database.default.database.*/database.default.database = '"$MYSQL_DATABASE"'/' Backend/applications/default/.env
sed -i 's/.*database.default.username.*/database.default.username = '"$MYSQL_USERNAME"'/' Backend/applications/default/.env
sed -i 's/.*database.default.password.*/database.default.password = '"$MYSQL_PASSWORD"'/' Backend/applications/default/.env
sed -i 's/.*#database.default.port.*/database.default.port = '"$MYSQL_PORT"'/' Backend/applications/default/.env

sed -i 's/.*db.mongodb.hostname.*/db.mongodb.hostname = '"$MONGO_HOST"'/' Backend/applications/default/.env
sed -i 's/.*db.mongodb.port.*/db.mongodb.port = '"$MONGO_PORT"'/' Backend/applications/default/.env
sed -i 's/.*db.mongodb.database.*/db.mongodb.database = '"$MONGO_DATABASE"'/' Backend/applications/default/.env
sed -i 's/.*db.mongodb.username.*/db.mongodb.username = '"$MONGO_USERNAME"'/' Backend/applications/default/.env
sed -i 's/.*db.mongodb.password.*/db.mongodb.password = '"$MONGO_PASSWORD"'/' Backend/applications/default/.env

sed -i 's/.*app.baseURL.*/app.baseURL = "'"$PHP_API_URL"'"/' Backend/applications/default/.env
sed -i 's/.*app.siteURL.*/app.siteURL = "'"$APP_URL"'"/' Backend/applications/default/.env
sed -i 's/.*app.nodeApiUrl.*/app.nodeApiUrl = "'"$NODE_API_URL"'"/' Backend/applications/default/.env
sed -i 's/.*app.dataURL.*/app.dataURL = "'"$PHP_API_URL"'"/' Backend/applications/default/.env
sed -i 's/.*#sparkRunningPort.*/sparkRunningPort = '"$PHP_API_PORT"'/' Backend/applications/default/.env
sed -i 's/.*#sparkRunningHost.*/sparkRunningHost = '"$PHP_API_HOST"'/' Backend/applications/default/.env
printf "Done setup env file in Backend/applications/default/.env...\n"


printf "Setup env Frontend...\n"
cp Frontend/env Frontend/.env
printf "Done setup env file in Frontend/.env...\n"

cp Frontend/env.development Frontend/.env.development
sed -i 's/.*HOST.*/HOST="'"$APP_HOST"'"/' Frontend/.env.development
sed -i 's/.*VITE_PORT.*/VITE_PORT='"$APP_PORT"'/' Frontend/.env.development
sed -i 's/.*VITE_APP_URL.*/VITE_APP_URL="'"$APP_URL"'"/' Frontend/.env.development
sed -i 's/.*VITE_APP_API_URL.*/VITE_APP_API_URL="'"$PHP_API_URL"'"/' Frontend/.env.development
sed -i 's/.*VITE_APP_NODE_API_URL.*/VITE_APP_NODE_API_URL="'"$NODE_API_URL"'"/' Frontend/.env.development
sed -i 's/.*VITE_APP_FIRESTORE_DB.*/VITE_APP_FIRESTORE_DB="'"$FIRESTORE_DB"'"/' Frontend/.env.development
printf "Done setup env file in Frontend/.env.development...\n"

cp Frontend/env.production Frontend/.env.production
sed -i 's/.*HOST.*/HOST="'"$APP_HOST"'"/' Frontend/.env.production
sed -i 's/.*VITE_PORT.*/VITE_PORT='"$APP_PORT"'/' Frontend/.env.production
sed -i 's/.*VITE_APP_URL.*/VITE_APP_URL="'"$APP_URL"'"/' Frontend/.env.production
sed -i 's/.*VITE_APP_API_URL.*/VITE_APP_API_URL="'"$PHP_API_URL"'"/' Frontend/.env.production
sed -i 's/.*VITE_APP_NODE_API_URL.*/VITE_APP_NODE_API_URL="'"$NODE_API_URL"'"/' Frontend/.env.production
sed -i 's/.*VITE_APP_FIRESTORE_DB.*/VITE_APP_FIRESTORE_DB="'"$FIRESTORE_DB"'"/' Frontend/.env.production
printf "Done setup env file in Frontend/.env.production...\n"


printf "Setup env Server...\n"
cp Server/env Server/.env
printf "Done setup env file in Server/.env...\n"

cp Server/env.development Server/.env.development
sed -i 's/^PORT.*/PORT='"$NODE_API_PORT"'/' Server/.env.development
sed -i 's/.*MYSQL_HOST.*/MYSQL_HOST="'"$MYSQL_HOST"'"/' Server/.env.development
sed -i 's/.*MYSQL_PORT.*/MYSQL_PORT="'"$MYSQL_PORT"'"/' Server/.env.development
sed -i 's/.*MYSQL_USERNAME.*/MYSQL_USERNAME="'"$MYSQL_USERNAME"'"/' Server/.env.development
sed -i 's/.*MYSQL_PASSWORD.*/MYSQL_PASSWORD="'"$MYSQL_PASSWORD"'"/' Server/.env.development
sed -i 's/.*MYSQL_DATABASE.*/MYSQL_DATABASE="'"$MYSQL_DATABASE"'"/' Server/.env.development

sed -i 's/.*MONGODB_URI.*/MONGODB_URI="'"$MONGO_DB_URI"'"/' Server/.env.development

sed -i 's/.*SITEURL.*/SITEURL="'"$APP_URL"'"/' Server/.env.development
sed -i 's/.*BASEURL.*/BASEURL="'"$PHP_API_URL"'"/' Server/.env.development
sed -i 's/.*NODEAPIURL.*/NODEAPIURL="'"$NODE_API_URL"'"/' Server/.env.development
sed -i 's/^CODE.*/CODE="'"$CODE"'"/' Server/.env.development
printf "Done setup env file in Frontend/.env.development...\n"

cp Server/env.production Server/.env.production
sed -i 's/^PORT.*/PORT='"$NODE_API_PORT"'/' Server/.env.production
sed -i 's/.*MYSQL_HOST.*/MYSQL_HOST="'"$MYSQL_HOST"'"/' Server/.env.production
sed -i 's/.*MYSQL_PORT.*/MYSQL_PORT="'"$MYSQL_PORT"'"/' Server/.env.production
sed -i 's/.*MYSQL_USERNAME.*/MYSQL_USERNAME="'"$MYSQL_USERNAME"'"/' Server/.env.production
sed -i 's/.*MYSQL_PASSWORD.*/MYSQL_PASSWORD="'"$MYSQL_PASSWORD"'"/' Server/.env.production
sed -i 's/.*MYSQL_DATABASE.*/MYSQL_DATABASE="'"$MYSQL_DATABASE"'"/' Server/.env.production

sed -i 's/.*MONGODB_URI.*/MONGODB_URI="'"$MONGO_DB_URI"'"/' Server/.env.production

sed -i 's/.*SITEURL.*/SITEURL="'"$APP_URL"'"/' Server/.env.production
sed -i 's/.*BASEURL.*/BASEURL="'"$PHP_API_URL"'"/' Server/.env.production
sed -i 's/.*NODEAPIURL.*/NODEAPIURL="'"$NODE_API_URL"'"/' Server/.env.production
sed -i 's/^CODE=.*/CODE="'"$CODE"'"/' Server/.env.production
printf "Done setup env file in Server/.env.production...\n"

