echo 'import { lazy } from "react"' > ./src/build_modules.js
printf "\033[1;31m"
printf "build modules...\n"
for file in $(find './src/@modules' -name '*.js');
do
    if [[ "$file" == *"/pages/"* ]]; then
        printf $file"\n"
        echo 'lazy(() => import("'$file'"))' >> ./src/build_modules.js
    fi
done
echo "Build modules Complete!"
printf '\033[0m;'