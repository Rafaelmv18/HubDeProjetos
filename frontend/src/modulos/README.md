# modulos/

Um módulo por assunto do sistema, com os **mesmos nomes dos módulos do back-end** (`backend/app/Modulos/`). Decisão D37: primeiro o assunto, depois o tipo.

```
modulos/
└── kanban/
    ├── components/   ← componentes só deste módulo (CardTarefa, ColunaKanban)
    ├── hooks/        ← hooks só deste módulo (useTarefas, useMoverTarefa)
    ├── services/     ← chamadas à API deste módulo (kanbanApi.ts)
    ├── types.ts      ← tipos do módulo (Tarefa, Coluna)
    └── KanbanPage.tsx
```

**Regra:** um módulo não importa nada de dentro de outro módulo. Se dois módulos precisam da mesma coisa, ela vai para `compartilhado/`.

Os testes ficam ao lado do arquivo testado: `CardTarefa.tsx` → `CardTarefa.test.tsx`.
