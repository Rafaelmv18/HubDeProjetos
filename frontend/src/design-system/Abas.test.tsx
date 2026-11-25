import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import { Abas } from './Abas'

const ITENS = [
  { rotulo: 'Entrar', para: '/entrar' },
  { rotulo: 'Criar conta', para: '/criar-conta' },
]

// As abas são links, então precisam de um roteador em volta.
// O MemoryRouter "abre" o teste já no endereço escolhido.
function abrirEm(endereco: string) {
  render(
    <MemoryRouter initialEntries={[endereco]}>
      <Abas rotulo="Entrar ou criar conta" itens={ITENS} />
    </MemoryRouter>,
  )
}

describe('Abas', () => {
  it('é uma navegação com nome, para o leitor de tela anunciar', () => {
    abrirEm('/entrar')

    expect(
      screen.getByRole('navigation', { name: 'Entrar ou criar conta' }),
    ).toBeInTheDocument()
  })

  it('cada aba é um link para o endereço da tela', () => {
    abrirEm('/entrar')

    const navegacao = screen.getByRole('navigation')
    expect(
      within(navegacao).getByRole('link', { name: 'Entrar' }),
    ).toHaveAttribute('href', '/entrar')
    expect(
      within(navegacao).getByRole('link', { name: 'Criar conta' }),
    ).toHaveAttribute('href', '/criar-conta')
  })

  it('marca como atual só a aba do endereço aberto', () => {
    abrirEm('/criar-conta')

    expect(screen.getByRole('link', { name: 'Criar conta' })).toHaveAttribute(
      'aria-current',
      'page',
    )
    expect(screen.getByRole('link', { name: 'Entrar' })).not.toHaveAttribute(
      'aria-current',
    )
  })
})
