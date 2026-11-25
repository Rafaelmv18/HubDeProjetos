# design-system/

A versão em código do design system documentado em `docs/design-system.html`.

- **tokens:** cores, fontes, espaçamentos, raios e sombras, como variáveis CSS
- **componentes genéricos:** `Botao`, `Campo`, `Cartao`, `Etiqueta`...

Os componentes daqui **não conhecem o negócio**: um `Botao` não sabe o que é uma tarefa. O que conhece o negócio vai para `compartilhado/` ou para o módulo.
