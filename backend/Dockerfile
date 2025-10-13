
FROM node:20-alpine AS builder


WORKDIR /usr/src/app


COPY package*.json ./


RUN npm i


COPY . .


RUN npm run build


FROM node:20-alpine AS runner


WORKDIR /usr/src/app


COPY --from=builder /usr/src/app/dist ./dist
COPY package*.json ./


RUN npm ci --only=production


EXPOSE 3000


CMD ["node", "dist/main.js"]