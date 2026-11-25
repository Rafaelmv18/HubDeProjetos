#!/bin/sh
# Roda só na primeira vez que o volume do banco é criado.
# Cria o banco separado que os testes automatizados (Pest) vão usar,
# para que rodar os testes nunca apague os dados de desenvolvimento.
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
  CREATE DATABASE "$POSTGRES_TEST_DB" OWNER "$POSTGRES_USER";
EOSQL

echo "Banco de testes \"$POSTGRES_TEST_DB\" criado."
