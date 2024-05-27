# Usa una immagine di base ufficiale di PHP 8.2 con estensioni necessarie e Composer
FROM php:8.2-fpm

# Installa le dipendenze del sistema operativo
RUN apt-get update && apt-get install -y \
    build-essential \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    git \
    curl \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Installa Composer
COPY --from=composer:2.2 /usr/bin/composer /usr/bin/composer

# Imposta la directory di lavoro
WORKDIR /var/www

# Copia i file del progetto
COPY . .

# Installa le dipendenze di Laravel
RUN composer install --prefer-dist --no-scripts --no-dev --ignore-platform-reqs

# Genera autoload per Composer
RUN composer dump-autoload --ignore-platform-reqs

# Imposta i permessi corretti
RUN chown -R www-data:www-data /var/www \
    && chmod -R 755 /var/www/storage \
    && chmod -R 755 /var/www/bootstrap/cache

# Espone la porta 9000 e avvia php-fpm
EXPOSE 9000
CMD ["php-fpm"]
