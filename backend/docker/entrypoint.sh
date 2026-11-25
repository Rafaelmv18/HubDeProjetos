#!/bin/sh
# Roda toda vez que o serviço "api" sobe.
# Deixa o Laravel pronto sozinho, sem nenhum comando a mais (RNF15).
set -e

# 1. Dependências: na primeira vez (ou depois de um clone), a pasta vendor/ não existe
if [ ! -f vendor/autoload.php ]; then
  echo "[api] Instalando as dependências do Composer..."
  composer install --no-interaction --prefer-dist
fi

# 2. Configuração do Laravel: cria o .env e a chave da aplicação, se faltarem
if [ ! -f .env ]; then
  echo "[api] Criando backend/.env a partir do .env.example..."
  cp .env.example .env
fi
if ! grep -q '^APP_KEY=base64:' .env; then
  php artisan key:generate --force
fi

# 3. Banco: cria ou atualiza as tabelas.
#    O docker-compose só sobe este serviço depois que o banco responde (healthcheck).
php artisan migrate --force

# 4. Dados de exemplo: só se o banco estiver vazio (os seeders entram na Etapa 2)
# php artisan db:seed --force

echo "[api] Pronto."
exec "$@"
