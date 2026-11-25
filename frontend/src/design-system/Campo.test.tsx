import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Campo } from './Campo'

describe('Campo', () => {
  it('liga o rótulo à caixa de texto: clicar no rótulo leva ao campo', () => {
    render(<Campo rotulo="E-mail" />)

    // getByLabelText só acha a caixa se o rótulo estiver ligado a ela
    expect(screen.getByLabelText('E-mail')).toBeInTheDocument()
  })

  it('repassa as propriedades para a caixa de texto', () => {
    render(
      <Campo
        rotulo="E-mail"
        type="email"
        name="email"
        autoComplete="email"
        placeholder="voce@empresa.com"
      />,
    )

    const caixa = screen.getByLabelText('E-mail')
    expect(caixa).toHaveAttribute('type', 'email')
    expect(caixa).toHaveAttribute('name', 'email')
    expect(caixa).toHaveAttribute('autocomplete', 'email')
    expect(caixa).toHaveAttribute('placeholder', 'voce@empresa.com')
  })

  it('avisa quem usa a cada letra digitada', async () => {
    const aoMudar = vi.fn()
    render(<Campo rotulo="Nome" onChange={aoMudar} />)

    await userEvent.type(screen.getByLabelText('Nome'), 'Ana')

    expect(aoMudar).toHaveBeenCalledTimes(3)
  })

  it('mostra a dica e a liga ao campo para o leitor de tela', () => {
    render(<Campo rotulo="Senha" dica="Mínimo de 8 caracteres." />)

    const caixa = screen.getByLabelText('Senha')
    expect(caixa).toHaveAccessibleDescription('Mínimo de 8 caracteres.')
    expect(caixa).not.toHaveAttribute('aria-invalid')
  })

  it('com erro: mostra a mensagem, marca o campo como inválido e liga os dois', () => {
    render(<Campo rotulo="E-mail" erro="Este e-mail já está cadastrado." />)

    const caixa = screen.getByLabelText('E-mail')
    expect(screen.getByText('Este e-mail já está cadastrado.')).toBeVisible()
    expect(caixa).toHaveAttribute('aria-invalid', 'true')
    expect(caixa).toHaveAccessibleDescription('Este e-mail já está cadastrado.')
  })

  it('o erro toma o lugar da dica', () => {
    render(
      <Campo
        rotulo="Senha"
        dica="Mínimo de 8 caracteres."
        erro="A senha é curta demais."
      />,
    )

    expect(
      screen.queryByText('Mínimo de 8 caracteres.'),
    ).not.toBeInTheDocument()
    expect(screen.getByText('A senha é curta demais.')).toBeInTheDocument()
  })

  it('dois campos na mesma tela não se confundem', () => {
    render(
      <>
        <Campo rotulo="E-mail" erro="E-mail inválido." />
        <Campo rotulo="Senha" />
      </>,
    )

    expect(screen.getByLabelText('E-mail')).toHaveAccessibleDescription(
      'E-mail inválido.',
    )
    expect(screen.getByLabelText('Senha')).not.toHaveAttribute('aria-invalid')
  })
})
