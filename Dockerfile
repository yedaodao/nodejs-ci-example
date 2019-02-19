FROM node:8.15.0-slim
ENV NODE_OPTS ""
EXPOSE 3000
WORKDIR /opt/app

# prepare
COPY ./ /opt/app/

# build
RUN npm install
RUN npm run prod
# 使用该命令清理编译依赖，减少打包体积
RUN npm prune --production
RUN cp -r ./node_modules ./build

# start
WORKDIR build/srv
ENV NODE_ENV production
ENTRYPOINT node $NODE_OPTS app.js
