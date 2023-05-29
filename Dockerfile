FROM registry.yandex.net/toolbox/nodejs:12-xenial

WORKDIR /app

COPY .next ./.next
COPY dist ./dist
COPY node_modules ./node_modules
COPY public ./public
COPY next-env.d.ts ./
COPY next.config.js ./
COPY package.json ./

ARG APP_VERSION

ENV APP_VERSION=${APP_VERSION} \
    CFG_DIR=/app/dist/src/server/configs/ \
    NODE_PATH=/app/dist

CMD node /app/dist/src/server/index.js
