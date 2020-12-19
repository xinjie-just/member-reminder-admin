FROM nginx:stable
RUN mkdir -p web/logs
ADD extract_admin.conf /etc/nginx/conf.d/default.conf
ADD dist web/dist
EXPOSE 82
# CMD cd /code/admin/ \
#     && sh start_server.sh%
