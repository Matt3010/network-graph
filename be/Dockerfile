FROM php:8.2-apache

# Aggiorna l'elenco dei pacchetti e installa le dipendenze necessarie per Laravel e PostgreSQL
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libzip-dev \
    zip \
    unzip \
    libpq-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install gd pdo pdo_mysql pdo_pgsql zip
# Attiva i moduli di Apache necessari
RUN a2enmod rewrite

# Imposta la directory di lavoro nell'app Laravel
WORKDIR /var/www/html

# Copia i file dell'applicazione nell'immagine Docker
COPY . .

COPY .env.prod .env

# Installa le dipendenze PHP usando Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
RUN composer install

# Imposta i permessi appropriati per l'applicazione Laravel
RUN chown -R www-data:www-data /var/www/html/storage
RUN chown -R www-data:www-data /var/www/html/bootstrap/cache

# Copia il file di configurazione per Apache
COPY laravel.conf /etc/apache2/sites-available/000-default.conf

# Abilita il modulo di PostgreSQL
RUN docker-php-ext-enable pdo_pgsql

# Esponi la porta 80 per il traffico HTTP
EXPOSE 80

# Comando di avvio per l'immagine Docker
CMD ["apache2-foreground"]
