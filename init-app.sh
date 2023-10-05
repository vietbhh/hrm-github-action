
#!/bin/bash
printf "Initialing app env...\n"
export COMPOSER_ALLOW_SUPERUSER=1
export NODE_OPTIONS="--max-old-space-size=8192"
DB_NAME=$1
if [[ -z $3 || -z $4 ]]; then
printf "Initialing app by friday build server...\n"

BUILD_SV=$2
declare -A build=( [app_port]="3000" [app_url]="app.build.friday.vn:86" [php_port]="3001" [php_url]="be.build.friday.vn:86" [node_port]="3002" [node_url]="sv.build.friday.vn:86")
declare -A build1=( [app_port]="3010" [app_url]="app1.build.friday.vn:86" [php_port]="3011" [php_url]="be1.build.friday.vn:86" [node_port]="3012" [node_url]="sv1.build.friday.vn:86")
declare -A build2=( [app_port]="3020" [app_url]="app2.build.friday.vn:86" [php_port]="3021" [php_url]="be2.build.friday.vn:86" [node_port]="3022" [node_url]="sv2.build.friday.vn:86")
declare -A build3=( [app_port]="3030" [app_url]="app3.build.friday.vn:86" [php_port]="3031" [php_url]="be3.build.friday.vn:86" [node_port]="3032" [node_url]="sv3.build.friday.vn:86")
declare -A build4=( [app_port]="3040" [app_url]="app4.build.friday.vn:86" [php_port]="3041" [php_url]="be4.build.friday.vn:86" [node_port]="3042" [node_url]="sv4.build.friday.vn:86")
declare -A build5=( [app_port]="3050" [app_url]="app5.build.friday.vn:86" [php_port]="3051" [php_url]="be5.build.friday.vn:86" [node_port]="3052" [node_url]="sv5.build.friday.vn:86")
declare -A build6=( [app_port]="3060" [app_url]="app6.build.friday.vn:86" [php_port]="3061" [php_url]="be6.build.friday.vn:86" [node_port]="3062" [node_url]="sv6.build.friday.vn:86")
declare -A build7=( [app_port]="3070" [app_url]="app7.build.friday.vn:86" [php_port]="3071" [php_url]="be7.build.friday.vn:86" [node_port]="3072" [node_url]="sv7.build.friday.vn:86")
declare -A build8=( [app_port]="3080" [app_url]="app8.build.friday.vn:86" [php_port]="3081" [php_url]="be8.build.friday.vn:86" [node_port]="3082" [node_url]="sv8.build.friday.vn:86")
declare -A build9=( [app_port]="3090" [app_url]="app9.build.friday.vn:86" [php_port]="3091" [php_url]="be9.build.friday.vn:86" [node_port]="3092" [node_url]="sv9.build.friday.vn:86")
declare -A build10=( [app_port]="3110" [app_url]="app10.build.friday.vn:86" [php_port]="3111" [php_url]="be10.build.friday.vn:86" [node_port]="3112" [node_url]="sv10.build.friday.vn:86")
declare -a LISTS=(build build1 build2 build3 build4 build5 build6 build7 build8 build9 build10)

APP_PORT="8000"
APP_HOST="localhost"
APP_URL=$APP_PORT":"$APP_PORT
PHP_PORT="8001"
PHP_API_HOST="localhost"
PHP_URL=$PHP_API_HOST":"$PHP_PORT
NODE_PORT="8002"
NODE_API_HOST="localhost"
NODE_URL=$NODE_API_HOST":"$NODE_PORT
HOST_PROTOCOL="https"
ENV_TYPE="both"
for ((i=0; i<"${#LISTS[*]}"; i++)); do
    BUILD_CURRENT="${LISTS[$i]}"
    if [ $BUILD_CURRENT == $BUILD_SV ]; then
    CURRENT_APP_PORT="${BUILD_CURRENT}[app_port]"
    CURRENT_APP_URL="${BUILD_CURRENT}[app_url]"
    CURRENT_PHP_PORT="${BUILD_CURRENT}[php_port]"
    CURRENT_PHP_URL="${BUILD_CURRENT}[php_url]"
    CURRENT_NODE_PORT="${BUILD_CURRENT}[node_port]"
    CURRENT_NODE_URL="${BUILD_CURRENT}[node_url]"

    APP_PORT=${!CURRENT_APP_PORT}
    APP_URL=${!CURRENT_APP_URL}
    PHP_PORT=${!CURRENT_PHP_PORT}
    PHP_URL=${!CURRENT_PHP_URL}
    NODE_PORT=${!CURRENT_NODE_PORT}    
    NODE_URL=${!CURRENT_NODE_URL}

    fi
done
else
printf "Initialing app by params...\n"
APP_PORT=$2
PHP_PORT=$3
NODE_PORT=$4

HOST=$5
if [[ -z $5 ]]; then
HOST="localhost"
fi

APP_HOST=$HOST
PHP_API_HOST=$HOST
NODE_API_HOST=$HOST
APP_URL=$APP_HOST":"$APP_PORT
PHP_URL=$PHP_API_HOST":"$PHP_PORT
NODE_URL=$NODE_API_HOST":"$NODE_PORT

ENV_TYPE=$6
if [[ -z $6 ]]; then
ENV_TYPE="dev"
fi

HOST_PROTOCOL=$7
if [[ -z $7 ]]; then
HOST_PROTOCOL="http"
fi

fi

cp env .env
sed -i 's/^APP_HOST.*/APP_HOST="'"$APP_HOST"'"/' .env
sed -i 's/^APP_PORT.*/APP_PORT="'"$APP_PORT"'"/' .env
sed -i 's/^APP_URL.*/APP_URL="'"$APP_URL"'"/' .env
sed -i 's/^PHP_API_HOST.*/PHP_API_HOST="'"$PHP_API_HOST"'"/' .env
sed -i 's/^PHP_API_PORT.*/PHP_API_PORT="'"$PHP_PORT"'"/' .env
sed -i 's/^PHP_API_URL.*/PHP_API_URL="'"$PHP_URL"'"/' .env
sed -i 's/^NODE_API_HOST.*/NODE_API_HOST="'"$NODE_API_HOST"'"/' .env
sed -i 's/^NODE_API_PORT.*/NODE_API_PORT="'"$NODE_PORT"'"/' .env
sed -i 's/^NODE_API_URL.*/NODE_API_URL="'"$NODE_URL"'"/' .env
sed -i 's/^MYSQL_DATABASE.*/MYSQL_DATABASE="'"$DB_NAME"'"/' .env
sed -i 's/^MONGO_DATABASE.*/MONGO_DATABASE="'"$DB_NAME"'"/' .env
sed -i 's/^FIRESTORE_DB.*/FIRESTORE_DB="'"$DB_NAME"'"/' .env
sed -i 's/^HOST_PROTOCOL.*/HOST_PROTOCOL="'"$HOST_PROTOCOL"'"/' .env
sed -i 's/^ENV_TYPE.*/ENV_TYPE="'"$ENV_TYPE"'"/' .env
chmod +x init-env.sh
chmod +x remove-all-dep.sh


