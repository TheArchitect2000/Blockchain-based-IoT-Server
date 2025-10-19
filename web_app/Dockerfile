
FROM node:20-alpine AS builder
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build


FROM nginx:alpine AS runner


COPY --from=builder /usr/src/app/build /usr/share/nginx/html


COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]