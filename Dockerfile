FROM node:14.15-alpine

WORKDIR /root/lol-hub-bot/

COPY . /root/lol-hub-bot/
RUN yarn install --production

ENTRYPOINT npm run prod