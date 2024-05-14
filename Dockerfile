# Fase di build
FROM node:latest as builder

WORKDIR /app

COPY . .

# Installazione delle dipendenze e build dell'applicazione
RUN npm install && npm run build

# Fase di produzione
FROM nginx:latest

# Copia dei file statici dell'applicazione nella directory di default di NGINX
COPY --from=builder /app/dist/* /usr/share/nginx/html/

# Esposizione della porta 80
EXPOSE 80

# Comando per avviare NGINX quando il container viene eseguito
CMD ["nginx", "-g", "daemon off;"]
