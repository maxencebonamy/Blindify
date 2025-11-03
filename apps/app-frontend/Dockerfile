FROM node:20-alpine AS builder
WORKDIR /app

ARG VITE_APP_REDIRECT_URL
ENV VITE_APP_REDIRECT_URL=$VITE_APP_REDIRECT_URL

ARG VITE_BACKEND_URL
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL

COPY package.json ./
COPY tsconfig.json ./
COPY apps/app-frontend ./apps/app-frontend
COPY libs ./libs

RUN npm install -g pnpm
RUN pnpm install
RUN pnpm --filter "./libs/*" install
RUN pnpm --filter "./libs/*" build
RUN pnpm --filter "./apps/app-frontend" install
RUN pnpm --filter "./apps/app-frontend" gen
RUN pnpm --filter "./apps/app-frontend" build

FROM nginx:alpine
WORKDIR /usr/share/nginx/html

COPY --from=builder /app/apps/app-frontend/dist ./

RUN echo 'server { \
    listen 80; \
    server_name _; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
