FROM node:18-alpine AS build
WORKDIR /app
COPY package.json .
COPY package-lock.json .
RUN npm install

COPY ./ .
ENV VITE_API_BASE_URL="https://api.setti.me"
RUN npm run build

FROM nginx:alpine
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY . .
COPY ./nginx.conf /etc/nginx/nginx.conf
EXPOSE 8080