FROM node:22-alpine AS builder
WORKDIR /app

ARG API_URL=http://localhost:8000

COPY package.json yarn.lock* ./
RUN yarn install --frozen-lockfile

COPY . .

ENV API_URL=${API_URL}
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_PUBLIC_CLOUDFRONT_URL=https://d2nwrdddg8skub.cloudfront.net/images

RUN yarn build

FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ENV NEXT_TELEMETRY_DISABLED=1

RUN apk add --no-cache curl

COPY --from=builder /app/.next/standalone .
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["node", "server.js"]