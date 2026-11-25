# collab/

Aqui vai morar o **serviço de edição em conjunto** dos documentos do Hub: várias pessoas escrevendo no mesmo documento ao mesmo tempo, cada uma vendo o que as outras digitam.

**Ainda está vazio de propósito.** O serviço só é construído na Etapa 8 do plano (`docs/plano.html`). A pasta já existe para a estrutura do projeto ficar completa desde o começo (decisão D31: um repositório só, com `backend/`, `frontend/` e `collab/`).

## O que será

Um serviço pequeno em Node.js + TypeScript, usando o **Hocuspocus**. Ele roda como mais um serviço do `docker-compose.yml`, na porta interna 1234, e o navegador chega nele pelo mesmo endereço do resto do sistema (`/collab`, repassado pelo Vite).

## Como as peças se dividem

| Peça | Onde fica | O que faz |
| --- | --- | --- |
| TipTap | `frontend/` | O editor de texto que a pessoa usa |
| Yjs | `frontend/` e `collab/` | Junta as edições de várias pessoas sem conflito |
| Hocuspocus | `collab/` | O servidor que recebe e repassa as edições entre os navegadores |

O `backend/` (Laravel) continua sendo quem decide **quem pode abrir** cada documento. O `collab/` só cuida de sincronizar o texto.

Os detalhes estão em `docs/arquitetura.html`.
