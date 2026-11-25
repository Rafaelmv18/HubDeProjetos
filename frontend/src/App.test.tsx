import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { afterEach, describe, expect, it, vi } from 'vitest'
import App from './App'

// O MemoryRouter faz o papel da barra de endereço do navegador:
// cada teste "abre" o app já em um endereço escolhido.
function abrirEm(endereco: string) {
  render(
    <MemoryRouter initialEntries={[endereco]}>
      <App />
    </MemoryRouter>,
  )
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('rotas do app', () => {
  it('/entrar mostra a tela de entrar', () => {
    abrirEm('/entrar')

    expect(
      screen.getByRole('heading', { name: 'Entrar na sua conta' }),
    ).toBeInTheDocument()
  })

  it('/criar-conta mostra a tela de criar conta', () => {
    abrirEm('/criar-conta')

    expect(
      screen.getByRole('heading', { name: 'Criar sua conta' }),
    ).toBeInTheDocument()
  })

  it('a raiz leva para a tela de entrar', () => {
    abrirEm('/')

    expect(
      screen.getByRole('heading', { name: 'Entrar na sua conta' }),
    ).toBeInTheDocument()
  })

  it('um endereço que não existe leva para a tela de entrar', () => {
    abrirEm('/nao-existe')

    expect(
      screen.getByRole('heading', { name: 'Entrar na sua conta' }),
    ).toBeInTheDocument()
  })

  it('as abas levam de uma tela de entrada para a outra', async () => {
    abrirEm('/entrar')

    await userEvent.click(screen.getByRole('link', { name: 'Criar conta' }))
    expect(
      screen.getByRole('heading', { name: 'Criar sua conta' }),
    ).toBeInTheDocument()

    await userEvent.click(screen.getByRole('link', { name: 'Entrar' }))
    expect(
      screen.getByRole('heading', { name: 'Entrar na sua conta' }),
    ).toBeInTheDocument()
  })

  it('/saude mostra a página de saúde do sistema', () => {
    // A API nunca responde: a página fica em "Carregando…"
    vi.stubGlobal(
      'fetch',
      vi.fn(() => new Promise<Response>(() => {})),
    )

    abrirEm('/saude')

    expect(screen.getByText('Carregando…')).toBeInTheDocument()
  })
})
