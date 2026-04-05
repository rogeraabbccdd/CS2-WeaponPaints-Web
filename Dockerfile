# PHP 8.2 with Apache for CS2 WeaponPaints Web
FROM php:8.2-apache

# Install system dependencies for cURL, SSL and MySQL
RUN apt-get update && apt-get install -y \
    libcurl4-openssl-dev \
    ca-certificates \
    && update-ca-certificates \
    && docker-php-ext-install pdo pdo_mysql mysqli curl

# Enable Apache mod_rewrite
RUN a2enmod rewrite

WORKDIR /var/www/html

# Grant permissions for PHP sessions
RUN chmod 777 /tmp