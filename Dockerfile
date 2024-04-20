# Build builder image
FROM node:20-alpine AS builder

WORKDIR /home/node/build

# Install depencencies
COPY package.json .
COPY yarn.lock .

COPY packages/frontend/package.json ./packages/frontend/package.json
COPY packages/server/package.json ./packages/server/package.json

RUN yarn install --frozen-lockfile

# Copy configuration files and assets
COPY packages/frontend/index.html ./packages/frontend/index.html
COPY packages/frontend/assets ./packages/frontend/assets
COPY packages/frontend/*.config.* ./packages/frontend/
COPY packages/frontend/tsconfig.json ./packages/frontend/tsconfig.json

COPY packages/server/tsconfig.json ./packages/server/tsconfig.json

# Copy code
COPY packages/frontend/src ./packages/frontend/src
COPY packages/server/src ./packages/server/src

RUN yarn build

# Build production image
FROM node:20-alpine

ENV NODE_ENV production

WORKDIR /home/node/app

# Install production dependencies
COPY --from=builder /home/node/build/package.json .
COPY --from=builder /home/node/build/yarn.lock .

COPY --from=builder /home/node/build/packages/server/package.json ./packages/server/package.json

RUN yarn workspace server install --prod --frozen-lockfile

WORKDIR /home/node/app/packages/server

# Copy server code
COPY --from=builder /home/node/build/packages/server/dist .

# Copy bundle and assets
COPY --from=builder /home/node/build/packages/server/public ./public

EXPOSE 8080

CMD ["node","app.js"]
