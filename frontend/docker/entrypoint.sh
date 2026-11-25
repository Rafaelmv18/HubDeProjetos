#!/bin/sh
# Roda toda vez que o serviço "web" sobe.
# Deixa o front-end pronto sozinho, sem nenhum comando a mais (RNF15).
set -e

# Dependências: na primeira vez (ou depois de um clone), a pasta node_modules/ não existe
if [ ! -d node_modules ] || [ -z "$(ls -A node_modules)" ]; then
  echo "[web] Instalando as dependências do npm..."
  npm install --no-fund --no-audit
fi

echo "[web] Pronto."
exec "$@"
