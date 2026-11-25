# lib/

A infraestrutura que o resto do front-end usa, sem regra de negócio:

- **cliente HTTP (`api.ts`):** o `api.get`, `api.post`, `api.put`, `api.patch` e `api.delete` chamam a API (`/api/...`), já preparados para o cookie de login e o CSRF. Quando a API recusa ou a rede falha, lançam um `ErroApi`, com o `status` e os erros de validação por campo
- **conexão ao vivo:** a ligação com o Reverb e o Hocuspocus (Etapa 8)

Os módulos usam o `lib/` em vez de chamar `fetch` direto. Assim, uma mudança no jeito de falar com a API acontece em um lugar só.
