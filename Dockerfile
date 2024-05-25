FROM node:18-alpine AS build
WORKDIR /app
COPY package.json .
COPY package-lock.json .
RUN npm install

COPY ./ .
RUN npm run build

FROM nginx:alpine
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY . .
COPY ./nginx.conf /etc/nginx/nginx.conf
EXPOSE 8080