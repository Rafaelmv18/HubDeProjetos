import { expect, test } from '@playwright/test'

// As telas de entrada, no navegador de verdade: os endereços funcionam
// e a moldura (marca + conteúdo) aparece.

test('a raiz do site leva para a tela de entrar', async ({ page }) => {
  await page.goto('/')

  await expect(page).toHaveURL(/\/entrar$/)
  await expect(
    page.getByRole('heading', { name: 'Entrar na sua conta' }),
  ).toBeVisible()
  await expect(page.getByText('Hub de Projetos')).toBeVisible()
})

test('as abas levam de entrar para criar conta, e o voltar funciona', async ({
  page,
}) => {
  await page.goto('/entrar')
  const abas = page.getByRole('navigation', { name: 'Entrar ou criar conta' })

  await abas.getByRole('link', { name: 'Criar conta' }).click()
  await expect(page).toHaveURL(/\/criar-conta$/)
  await expect(
    page.getByRole('heading', { name: 'Criar sua conta' }),
  ).toBeVisible()

  // O botão voltar do navegador funciona, porque cada tela tem endereço próprio
  await page.goBack()
  await expect(
    page.getByRole('heading', { name: 'Entrar na sua conta' }),
  ).toBeVisible()
})
