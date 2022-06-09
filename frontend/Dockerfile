FROM node:16-alpine as build

WORKDIR /usr/app
COPY package.json package-lock.json ./
RUN npm ci
COPY . ./
ARG VITE_API_URL
RUN npm run build

FROM nginx:stable-alpine as release

COPY --from=build /usr/app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/templates/default.conf.template

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
