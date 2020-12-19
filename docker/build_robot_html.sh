cd ..
git pull
npm run build
cp -R dist docker/
cd docker

TIMENOW=$(date +%Y%m%d_%H%M%S)
docker build -t dockerhub.datagrand.com/chengdushisuo/robot_management_html:product_${TIMENOW} .
docker build -t dockerhub.datagrand.com/chengdushisuo/robot_management_html:latest .
rm -rf dist

docker push dockerhub.datagrand.com/chengdushisuo/robot_management_html:product_${TIMENOW}
docker push dockerhub.datagrand.com/chengdushisuo/robot_management_html:latest
