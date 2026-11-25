#!/bin/sh
# Roda toda vez que o serviço "e2e" é chamado.
# Deixa os testes prontos para rodar sozinhos, sem nenhum comando a mais.
set -e

# Dependências: na primeira vez, a pasta node_modules/ não existe
if [ ! -d node_modules ] || [ -z "$(ls -A node_modules)" ]; then
  echo "[e2e] Instalando as dependências do npm..."
  npm install --no-fund --no-audit
fi

# Espera o front-end responder (até 2 minutos), para o teste não começar cedo demais
echo "[e2e] Esperando o front-end em $E2E_BASE_URL ..."
node -e '
  const url = process.env.E2E_BASE_URL
  const limite = Date.now() + 120000
  const tentar = () =>
    fetch(url)
      .then(() => process.exit(0))
      .catch(() => {
        if (Date.now() > limite) {
          console.error("[e2e] O front-end não respondeu em 2 minutos.")
          process.exit(1)
        }
        setTimeout(tentar, 1000)
      })
  tentar()
'

echo "[e2e] Pronto."
exec "$@"
