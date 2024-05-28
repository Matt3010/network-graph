# Step 1: Costruzione dell'applicazione Angular
FROM node AS build

# Imposta la directory di lavoro
WORKDIR /app

# Copia i file di configurazione di Angular
COPY package*.json ./

# Installa le dipendenze di Angular
RUN npm install

# Copia il resto dell'applicazione Angular
COPY . .

# Compila l'applicazione Angular
RUN npm run build-prod

# Step 2: Configurazione di Nginx per servire l'applicazione Angular
FROM nginx:alpine

# Copia il file di configurazione Nginx nel container
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia i file compilati di Angular nel container
COPY --from=build /app/dist/test-network /usr/share/nginx/html

# Espone la porta 80
EXPOSE 80

# Avvia Nginx
CMD ["nginx", "-g", "daemon off;"]
