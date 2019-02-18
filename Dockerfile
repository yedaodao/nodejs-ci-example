FROM node:8.15.0-alpine
ENV NODE_ENV production
ENV NODE_OPTS ""
EXPOSE 3000

# build
RUN npm install
RUN npm run build
# 使用该命令清理编译依赖，减少打包体积
RUN npm prune --production
RUN cp -r ./node_modules ./build
RUN cd ./build && cp -r * /opt/app/
WORKDIR /opt/app

# start
ENTRYPOINT node $NODE_OPTS app.js
