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

EXPOSE 3000
ENTRYPOINT ["npm", "run"]
CMD ["start"]
