FROM node:latest AS builder

WORKDIR /app

COPY package.json package-lock.json bun.lockb ./

RUN npm install --production

COPY . .

RUN npm run build

ARG DB_CREATE=false
RUN if [ "$DB_CREATE" = "true" ]; then npx sequelize-cli db:migrate; fi

ARG DB_MIGRATE=false
RUN if ["${DB_MIGRATE}" = "true"]; then npx sequelize-cli db:migrate; if

FROM oven/bun:1.0.7-alpine

WORKDIR /app

COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/package.json /app/package.json

CMD ["bun", "start"]