FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS build
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN apt-get update && apt-get install -y jq && apt-get clean
RUN ./install-dependencies.sh ./apps/app-backend/package.json
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run -r --filter=lib-database db:generate
RUN pnpm run -r --filter="./libs/*" gen
RUN pnpm run -r --filter=app-backend gen
RUN pnpm run -r --filter="./libs/*" build
RUN pnpm run -r --filter=app-backend build
RUN pnpm deploy --filter=app-backend --prod /prod/app-backend --legacy

FROM base AS app-backend
RUN apt-get update && apt-get install -y ffmpeg && apt-get clean
COPY --from=build /prod/app-backend /prod/app-backend
COPY --from=build /usr/src/app/libs/lib-database/src/generated /prod/app-backend/src/generated
COPY --from=build /usr/src/app/libs/lib-database/prisma /prod/app-backend/prisma
ENV PRISMA_QUERY_ENGINE_LIBRARY="/prod/app-backend/src/generated/libquery_engine-debian-openssl-1.1.x.so.node"
WORKDIR /prod/app-backend
EXPOSE 3000
CMD [ "pnpm", "start" ]
