FROM node:20-alpine
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
COPY tsconfig.json ./
COPY apps/app-backend ./apps/app-backend
COPY libs ./libs

RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile
RUN pnpm --filter "./libs/*" install
RUN pnpm --filter "./libs/*" build
RUN pnpm --filter "./apps/app-backend" install
RUN pnpm --filter "./apps/app-backend" build

EXPOSE 3000
CMD ["node", "apps/app-backend/dist/index.js"]
