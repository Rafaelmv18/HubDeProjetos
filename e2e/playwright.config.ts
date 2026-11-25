import { defineConfig, devices } from '@playwright/test'

// Testes de ponta a ponta (E2E): um navegador de verdade abre o sistema
// inteiro, com todos os serviços no ar. Rodam dentro do Docker:
//     docker compose run --rm e2e
export default defineConfig({
  // Onde ficam os testes
  testDir: './tests',

  // Se um teste falhar, o comando termina com erro (sem tentar de novo)
  retries: 0,

  // "list" mostra uma linha por teste no terminal
  reporter: 'list',

  use: {
    // Dentro do Docker, o front-end é alcançado pelo nome do serviço: web
    baseURL: process.env.E2E_BASE_URL ?? 'http://web:5173',

    // Quando um teste falha, guarda a gravação do que aconteceu
    // em test-results/ (abra com: npx playwright show-trace)
    trace: 'retain-on-failure',
  },

  // Por enquanto só o Chromium, que já vem na imagem do Docker
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
})
