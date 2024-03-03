FROM node:20 AS builder

WORKDIR /home/node/build

COPY package.json .
COPY package-lock.json .

RUN npm ci

COPY tsconfig.json .
COPY src ./src
COPY views ./views
COPY tailwind.config.js .

RUN npm run build

FROM node:20
FROM mcr.microsoft.com/playwright:jammy

# RUN apt-get update && apt-get -y install libnss3 libatk-bridge2.0-0 libdrm-dev libxkbcommon-dev libgbm-dev libasound-dev libatspi2.0-0 libxshmfence-dev

ENV NODE_ENV production

WORKDIR /home/node/app

COPY --from=builder /home/node/build/package.json .
COPY --from=builder /home/node/build/package-lock.json .

RUN npm ci

COPY --from=builder /home/node/build/build .
COPY --from=builder /home/node/build/public ./public
COPY --from=builder /home/node/build/views ./views

EXPOSE 8080

CMD ["node","app.js"]
