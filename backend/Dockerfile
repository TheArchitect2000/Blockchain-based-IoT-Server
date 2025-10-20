
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

RUN npm config set registry https://registry.npmjs.org/

RUN npm install -g npm@latest

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:20-alpine AS runner

WORKDIR /usr/src/app

RUN npm config set registry https://registry.npmjs.org/

COPY --from=builder /usr/src/app/dist ./dist
COPY package*.json ./


RUN npm install --omit=dev

CMD ["node", "dist/main.js"]