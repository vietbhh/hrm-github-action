echo "" > ./src/assets/scss/auto-modules-bundle.scss
printf "\033[1;31m"
printf "Injecting scss file...\n"
for file in $(find './src/@modules' -name '*.autoload.scss');
do
  printf $file"\n"
  echo "@import '"$file"';" >> ./src/assets/scss/auto-modules-bundle.scss
done
echo "Injection Complete!"
printf '\033[0m;'
