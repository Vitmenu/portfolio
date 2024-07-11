FROM node:lts-alpine as base

WORKDIR /app

COPY ./package.json .
RUN npm install --only=prod

FROM node:lts-alpine

EXPOSE 14001

USER node
RUN mkdir -p /home/node/app
WORKDIR /home/node/app

COPY . .
COPY --from=base /app/node_modules  /home/node/app/node_modules

USER node

CMD ["npm", "run", "dev"]
