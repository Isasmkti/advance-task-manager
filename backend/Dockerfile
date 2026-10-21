FROM php:8.4-fpm-alpine

# Install PostgreSQL PDO extension & bash
RUN apk add --no-cache libpq-dev bash \
    && docker-php-ext-install pdo_pgsql

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

COPY . .

# Jalankan composer install saat container dinyalakan dan jalankan server
CMD composer install && php artisan serve --host=0.0.0.0 --port=8000
