FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS build
ARG VITE_APP_REDIRECT_URL
ENV VITE_APP_REDIRECT_URL=$VITE_APP_REDIRECT_URL
ARG VITE_BACKEND_URL
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run -r --filter="./libs/*" gen
RUN pnpm run -r --filter=app-frontend gen
RUN pnpm run -r --filter="./libs/*" build
RUN pnpm run -r --filter=app-frontend build
RUN pnpm deploy --filter=app-frontend --prod /prod/app-frontend --legacy

FROM nginx:alpine AS app-frontend
WORKDIR /usr/share/nginx/html
COPY --from=build /prod/app-frontend/dist ./
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
COPY --from=build /usr/src/app/apps/app-frontend/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
CMD ["/entrypoint.sh"]
