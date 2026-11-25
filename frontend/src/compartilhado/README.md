# compartilhado/

O que **mais de um módulo** usa e que é específico do Hub de Projetos. Exemplos: `Avatar` de um membro, `useAuth` (quem está logado), `SeletorDeVisibilidade`.

Pode seguir a mesma divisão por tipo: `components/`, `hooks/`, `types.ts`.

**Qual a diferença para o `design-system/`?** O `design-system/` tem peças genéricas de interface (botão, campo, cartão), que não sabem nada do negócio. O `compartilhado/` tem peças que conhecem o negócio (membro, visibilidade, cargo).
