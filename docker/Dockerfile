FROM wordpress:php8.0-apache

RUN apt-get update && \ 
apt-get install -y --no-install-recommends net-tools && \ 
rm -r /var/lib/apt/lists/*
#a2enmod ssl && \
#a2ensite default-ssl

RUN echo 'alias ll="ls -lah --group-directories-first  --color=auto"' >/var/www/.bashrc
user www-data

EXPOSE 80 443
