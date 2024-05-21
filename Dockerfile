# Stage 1
FROM node:lts-alpine as node
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:1.19.2-alpine
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
RUN rm -rf /usr/share/nginx/html/*
COPY --from=node /usr/src/app/dist /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]
