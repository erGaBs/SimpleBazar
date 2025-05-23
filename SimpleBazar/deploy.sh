ng build --base-href "https://erGaBs.github.io/SimpleBazar/"
echo '<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=./index.html" /></head><body></body></html>' > dist/simple-bazar/404.html
npx angular-cli-ghpages --dir=dist/simple-bazar