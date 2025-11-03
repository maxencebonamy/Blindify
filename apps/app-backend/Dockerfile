FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS build
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run -r --filter="./libs/*" build
RUN pnpm run -r --filter=app-backend gen
RUN pnpm run -r --filter=app-backend build
RUN pnpm deploy --filter=app-backend --prod /prod/app-backend

FROM base AS app-backend
COPY --from=build /prod/app-backend /prod/app-backend
WORKDIR /prod/app-backend
EXPOSE 8000
CMD [ "pnpm", "start" ]

FROM base AS app2
COPY --from=build /prod/app2 /prod/app2
WORKDIR /prod/app2
EXPOSE 8001
CMD [ "pnpm", "start" ]

# FROM node:20-alpine
# WORKDIR /app

# COPY package.json ./
# COPY tsconfig.json ./
# COPY apps/app-backend ./apps/app-backend
# COPY libs ./libs

# RUN npm install -g pnpm
# RUN pnpm install
# RUN pnpm --filter "./libs/*" install
# RUN pnpm --filter "./libs/*" build
# RUN pnpm --filter "./apps/app-backend" install
# RUN pnpm --filter "./apps/app-backend" gen
# RUN pnpm --filter "./apps/app-backend" build

# EXPOSE 3000
# CMD ["node", "apps/app-backend/dist/index.js"]
