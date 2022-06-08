FROM node:16-alpine as base
RUN apk add python3 pixman-dev cairo-dev pango-dev jpeg-dev make g++

FROM base as build

WORKDIR /usr/app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM base as release

WORKDIR /usr/app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY --from=build /usr/app/build ./build

ENV PORT=3000
ENV LOG_LEVEL=
ENV CORS_ORIGIN=
ENV REDIS_URL=
ENV REDIS_EXPIRY=
ENV REDIS_RECONNECT_TIMEOUT=

EXPOSE ${PORT}

ENTRYPOINT ["npm", "run"]
CMD ["start"]
