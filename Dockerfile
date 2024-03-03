FROM node:20 AS builder

WORKDIR /home/node/build

COPY package.json .
COPY package-lock.json .

RUN PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 npm ci

COPY tsconfig.json .
COPY src ./src
COPY views ./views
COPY tailwind.config.js .

RUN npm run build

FROM node:20

ENV NODE_ENV production

WORKDIR /home/node/app

COPY --from=builder /home/node/build/package.json .
COPY --from=builder /home/node/build/package-lock.json .

RUN PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 npm ci
RUN npx playwright install --with-deps chromium

COPY --from=builder /home/node/build/build .
COPY --from=builder /home/node/build/public ./public
COPY --from=builder /home/node/build/views ./views

EXPOSE 8080

CMD ["node","app.js"]
