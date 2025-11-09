# Builder
FROM node:22-alpine AS builder
WORKDIR /app

ARG NODE_ENV=production
ENV NODE_ENV=$NODE_ENV

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .

RUN if [ "$NODE_ENV" != "development" ]; then yarn build; fi


# Runner
FROM node:22-alpine AS runner
WORKDIR /app

ARG NODE_ENV=production
ENV NODE_ENV=$NODE_ENV

ARG PORT=3000
ENV PORT=$PORT

COPY --from=builder /app/package.json ./

RUN yarn install --frozen-lockfile --production=true

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./next.config.ts

EXPOSE $PORT

CMD if [ "$NODE_ENV" = "development" ]; then yarn dev; else yarn start; fi
