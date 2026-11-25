import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import { LayoutEntrada } from './LayoutEntrada'

describe('LayoutEntrada', () => {
  it('mostra a marca e a frase de chamada no painel lateral', () => {
    const { container } = render(
      <LayoutEntrada titulo="Entrar">conteúdo</LayoutEntrada>,
    )

    expect(screen.getByText('Hub de Projetos')).toBeInTheDocument()
    // A frase é dividida em palavras para a animação, mas continua
    // sendo lida como uma frase só
    expect(container.querySelector('.hub-entrada__frase')).toHaveTextContent(
      'Todo o trabalho do seu setor em um só lugar.',
    )
  })

  it('usa o título da tela como o único título principal da página', () => {
    render(<LayoutEntrada titulo="Criar conta">conteúdo</LayoutEntrada>)

    const titulos = screen.getAllByRole('heading', { level: 1 })
    expect(titulos).toHaveLength(1)
    expect(titulos[0]).toHaveTextContent('Criar conta')
  })

  it('coloca o conteúdo da tela dentro da área principal', () => {
    render(
      <LayoutEntrada titulo="Entrar">
        <p>formulário aqui</p>
      </LayoutEntrada>,
    )

    // "main" é a região que o leitor de tela anuncia como conteúdo principal
    const principal = screen.getByRole('main')
    expect(within(principal).getByText('formulário aqui')).toBeInTheDocument()
    expect(
      within(principal).getByRole('heading', { name: 'Entrar' }),
    ).toBeInTheDocument()
  })

  it('sem pedir, não mostra as abas (ex.: na tela de recuperar senha)', () => {
    render(<LayoutEntrada titulo="Recuperar senha">conteúdo</LayoutEntrada>)

    expect(screen.queryByRole('navigation')).not.toBeInTheDocument()
  })

  it('com abas, mostra os links para entrar e criar conta acima do título', () => {
    render(
      // As abas são links, então precisam de um roteador em volta
      <MemoryRouter initialEntries={['/entrar']}>
        <LayoutEntrada titulo="Entrar na sua conta" comAbas>
          conteúdo
        </LayoutEntrada>
      </MemoryRouter>,
    )

    const abas = screen.getByRole('navigation', {
      name: 'Entrar ou criar conta',
    })
    expect(within(abas).getByRole('link', { name: 'Entrar' })).toHaveAttribute(
      'aria-current',
      'page',
    )
    expect(
      within(abas).getByRole('link', { name: 'Criar conta' }),
    ).toHaveAttribute('href', '/criar-conta')
  })

  it('esconde do leitor de tela os avisos de exemplo, que não são avisos de verdade', () => {
    const { container } = render(
      <LayoutEntrada titulo="Entrar">conteúdo</LayoutEntrada>,
    )

    const avisos = container.querySelectorAll('.hub-entrada__flutuante')
    expect(avisos).toHaveLength(2)
    avisos.forEach((aviso) => {
      expect(aviso.closest('[aria-hidden="true"]')).not.toBeNull()
    })
  })
})
