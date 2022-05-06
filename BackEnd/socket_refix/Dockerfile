FROM node:alpine

RUN mkdir -p /usr/src/node-app && chown -R node:node /usr/src/node-app

WORKDIR /usr/src/node-app

COPY package.json yarn.lock ./

# Pm2 release
# CMD yarn start

# Dev
CMD yarn dev


RUN yarn install --pure-lockfile

COPY --chown=node:node . .

EXPOSE 3000
FROM node:alpine

RUN mkdir -p /usr/src/node-app && chown -R node:node /usr/src/node-app

WORKDIR /usr/src/node-app

COPY package.json yarn.lock ./

# Pm2 release
# CMD yarn start

# Dev
CMD yarn start


RUN yarn install --pure-lockfile

COPY --chown=node:node . .

EXPOSE 3000
