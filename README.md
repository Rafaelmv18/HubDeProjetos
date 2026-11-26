# Hub de Projetos

> Nome provisório. Projeto de portfólio em construção.

Uma plataforma que junta em um só lugar o que as equipes costumam usar separado: **kanban de tarefas**, **arquivos com permissões**, **reuniões por vídeo** e **documentos editados em conjunto**. Tudo segue um modelo de acesso **hierárquico**: quem tem cargo acima vê o que está abaixo na sua cadeia, e cargos iguais e grupos diferentes ficam isolados.

## Status

🚧 **Etapa 0 concluída: o esqueleto do ambiente.** Um comando sobe o banco, a API e o front-end; a página inicial mostra a resposta da API, e os testes, a análise e a formatação rodam com um comando só. A próxima é a Etapa 1 (conta e login). O andamento completo está em [`docs/plano.html`](docs/plano.html).

## Stack

| Parte | Tecnologia |
|---|---|
| Back-end | Laravel (PHP), MVC com Services, organizado por módulos |
| Front-end | React + TypeScript + Vite, organizado por módulos |
| Banco de dados | PostgreSQL |
| Tempo real | Laravel Reverb · Hocuspocus + Yjs + TipTap |
| Vídeo | LiveKit |
| Ambiente | Docker Compose: um comando sobe tudo |
| Qualidade | TDD com Pest, Vitest, Testing Library e Playwright · Larastan, Pint, oxlint e Prettier |

## Como rodar

Pré-requisito: [Docker Desktop](https://www.docker.com/products/docker-desktop/) aberto. Não é preciso instalar PHP, Composer, Node.js nem PostgreSQL, porque tudo roda nos contêineres.

```bash
cp .env.example .env
docker compose up -d --wait
```

No PowerShell do Windows, o primeiro comando é `Copy-Item .env.example .env`.

Na primeira vez, o banco é criado e a API e o front-end instalam as dependências sozinhos. Isso leva de 6 a 10 minutos, conforme a internet; nas vezes seguintes, alguns segundos. O `--wait` faz o comando só terminar quando os quatro serviços estiverem prontos.

Depois, abra `http://localhost:5173` (a tela de entrar) e, para conferir a saúde do sistema, `http://localhost:5173/saude`. Essa página deve mostrar **banco: ok**, o que confirma que o navegador, o front-end, a API e o banco estão conversando.

### Os serviços

| Serviço | O que é | Endereço |
|---|---|---|
| `web` | Front-end (React + Vite) | `http://localhost:5173` |
| `api` | Back-end (Laravel) | pelo front-end, em `http://localhost:5173/api` |
| `db` | PostgreSQL | `localhost:5433` (a 5433, e não a 5432, para não conflitar com um PostgreSQL instalado no Windows) |
| `mailpit` | Caixa de e-mails de teste (nenhum e-mail sai da máquina) | `http://localhost:8025` |
| `e2e` | Testes de ponta a ponta (Playwright) | só roda quando é chamado |

### Comandos mais usados

| Quero... | Comando |
|---|---|
| Ver se está rodando | `docker compose ps` |
| Ver o log da API ou do front-end | `docker compose logs -f api` · `docker compose logs -f web` |
| Conferir tudo (formatação, análise e testes dos dois lados) | `.\check.ps1` (PowerShell) |
| Rodar os testes do back-end | `docker compose exec api vendor/bin/pest` |
| Rodar os testes do front-end | `docker compose exec web npm run test` |
| Rodar os testes de ponta a ponta | `docker compose run --rm e2e` |
| Rodar um comando do Laravel | `docker compose exec api php artisan <comando>` |
| Desligar | `docker compose down` |
| Desligar e apagar o banco local | `docker compose down -v` |

Na primeira vez, os testes de ponta a ponta baixam a imagem do Playwright, que ocupa 3,6 GB.

📘 **Todos os comandos, explicados, e a solução de problemas comuns estão no [Guia do desenvolvedor](docs/guia.html).**

## Documentação

| Documento | Conteúdo |
|---|---|
| [Requisitos](docs/requisitos.html) | Escopo, requisitos, histórias de usuário e decisões |
| [Wireframes](docs/wireframes.html) | As telas navegáveis |
| [Modelo de dados](docs/modelo-de-dados.html) | As tabelas e a regra de acesso em SQL |
| [Design system](docs/design-system.html) | Cores, fontes e componentes |
| [Arquitetura](docs/arquitetura.html) | Serviços, pastas, fluxos e testes |
| [Plano de construção](docs/plano.html) | O checklist do andamento |
| [Guia do desenvolvedor](docs/guia.html) | Como rodar, testar e resolver problemas |
