FROM node:18-alpine AS build
WORKDIR /app
COPY app/package.json .
COPY app/package-lock.json .
RUN npm install

COPY app/ .
ENV VITE_API_BASE_URL="https://api.setti.me"
RUN npm run build

FROM nginx:alpine
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY . .
COPY ./nginx.conf /etc/nginx/nginx.conf