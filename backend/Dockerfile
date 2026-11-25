# Imagem do serviço "api" (Laravel) para o ambiente local.
# PHP 8.5 na versão alpine (enxuta), com a extensão do PostgreSQL.
FROM php:8.5.12-cli-alpine

# Extensões do PHP: pdo_pgsql (PostgreSQL) e pcntl (usada pelo Laravel em filas e no Reverb).
# PCOV: mede quais linhas os testes executam (relatório de cobertura do Pest).
# Versão fixa: atualizar de propósito, nunca por acaso.
RUN apk add --no-cache postgresql-libs \
 && apk add --no-cache --virtual .build-deps postgresql-dev $PHPIZE_DEPS linux-headers \
 && docker-php-ext-install pdo_pgsql pcntl \
 && pecl install pcov-1.0.12 \
 && docker-php-ext-enable pcov \
 && apk del .build-deps

# Composer, copiado da imagem oficial (mesma versão usada para criar o projeto)
COPY --from=composer:2.11.1 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/backend

COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

EXPOSE 8000
ENTRYPOINT ["entrypoint.sh"]
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
