FROM node:current-alpine AS base
# Build stage
FROM base AS build
WORKDIR /build 

COPY . .
RUN npm -g i pnpm
RUN pnpm install --frozen-lockfile
# Populate the database with initial data
RUN --mount=type=secret,id=DOTENV,target=/build/.env \
	node populate-db.js 
# Build the application
RUN pnpm build --preset node-server

FROM base AS production
WORKDIR /app
COPY --from=build /build/.output /app


EXPOSE 3000

CMD ["node", "./server/index.mjs"]
