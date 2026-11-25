# Front-end · Hub de Projetos

React + TypeScript + Vite, organizado por módulos (decisão D37):

```
src/
├── modulos/        ← um por assunto, com os mesmos nomes do back-end
├── compartilhado/  ← o que mais de um módulo usa
├── design-system/  ← tokens e componentes genéricos de interface
└── lib/            ← cliente HTTP e conexões ao vivo
```

Cada pasta tem um `README.md` explicando o que vai nela.

Não rode `npm` direto no Windows: o front-end roda no serviço `web` do Docker. Como subir, os comandos e a solução de problemas estão no [Guia do desenvolvedor](../docs/guia.html).
