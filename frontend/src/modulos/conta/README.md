# modulos/conta/

Tudo o que o usuário faz com a própria conta (Etapa 1, histórias US01 a US04). É o par do módulo `backend/app/Modulos/Conta/`.

- **Criar conta** (US01)
- **Entrar e sair** (US02)
- **Recuperar a senha** (US03)
- **Editar o perfil** (US04)

As pastas (`components/`, `hooks/`, `services/`) e o `types.ts` nascem junto com o primeiro arquivo de cada uma, seguindo o formato descrito em `modulos/README.md`.

Saber **quem está logado** interessa a todos os módulos, então isso (`useAuth`) fica em `compartilhado/`, e não aqui.
