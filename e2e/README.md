# e2e/

Testes de **ponta a ponta** (E2E), feitos com o **Playwright**: um navegador de verdade abre o Hub e usa o sistema como uma pessoa usaria, com todos os serviços no ar (front-end, API e banco). Aqui nada é fingido.

Ficam na raiz, fora de `backend/` e `frontend/`, porque atravessam o sistema inteiro (decisão D40).

## Como rodar

Na raiz do projeto, com o Docker no ar:

```
docker compose run --rm e2e
```

O serviço `e2e` não sobe com o `docker compose up -d`. Ele só roda quando é chamado, executa os testes e desliga. Na primeira vez o Docker baixa a imagem do Playwright, que é grande (já vem com o navegador).

## O que tem aqui

| Arquivo | Para que serve |
| --- | --- |
| `tests/` | Os testes. Um arquivo por fluxo: `saude.spec.ts`, depois `conta.spec.ts`... |
| `playwright.config.ts` | Configuração: onde estão os testes e qual endereço abrir |
| `package.json` | Só o Playwright, na **mesma versão** da imagem do `docker-compose.yml` |
| `docker/entrypoint.sh` | Instala as dependências e espera o front-end responder |

## Regras

- **Poucos testes, só os fluxos principais.** São lentos. Os detalhes de cada tela são testados com o Vitest, dentro do `frontend/`.
- **A versão do Playwright aparece em dois lugares** (`package.json` e a imagem no `docker-compose.yml`). Ao atualizar, mude os dois juntos.
