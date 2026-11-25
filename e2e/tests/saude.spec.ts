import { expect, test } from '@playwright/test'

// O primeiro teste de ponta a ponta: prova que navegador, React, proxy do
// Vite, Laravel e banco estão conversando. Aqui nada é fingido.
test('a página de saúde mostra que o banco está ok', async ({ page }) => {
  // "/saude" é completado com o baseURL do playwright.config.ts
  await page.goto('/saude')

  await expect(
    page.getByRole('heading', { name: 'Hub de Projetos' }),
  ).toBeVisible()

  // O expect do Playwright espera sozinho o texto aparecer. O padrão é 5 s,
  // mas a API pode demorar mais quando acabou de rodar outros testes:
  // por isso este espera até 15 s.
  await expect(page.getByText('banco: ok')).toBeVisible({ timeout: 15_000 })
})
