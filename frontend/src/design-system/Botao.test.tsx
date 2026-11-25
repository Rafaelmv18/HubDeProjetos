import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Botao } from './Botao'

describe('Botao', () => {
  it('mostra o texto e chama a ação ao clicar', async () => {
    const aoClicar = vi.fn()
    render(<Botao onClick={aoClicar}>Criar tarefa</Botao>)

    await userEvent.click(screen.getByRole('button', { name: 'Criar tarefa' }))

    expect(aoClicar).toHaveBeenCalledTimes(1)
  })

  it('não envia formulário por acidente: o tipo padrão é "button"', () => {
    render(<Botao>Cancelar</Botao>)

    expect(screen.getByRole('button')).toHaveAttribute('type', 'button')
  })

  it('aceita type="submit" para ser o botão que envia o formulário', () => {
    render(<Botao type="submit">Entrar</Botao>)

    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit')
  })

  it.each([
    ['primario', 'hub-botao--primario'],
    ['fantasma', 'hub-botao--fantasma'],
    ['perigo', 'hub-botao--perigo'],
  ] as const)('a variante %s muda a aparência', (variante, classe) => {
    render(<Botao variante={variante}>Ação</Botao>)

    expect(screen.getByRole('button')).toHaveClass('hub-botao', classe)
  })

  it('desabilitado não chama a ação', async () => {
    const aoClicar = vi.fn()
    render(
      <Botao disabled onClick={aoClicar}>
        Entrar
      </Botao>,
    )

    await userEvent.click(screen.getByRole('button'))

    expect(aoClicar).not.toHaveBeenCalled()
  })

  it('carregando avisa o leitor de tela e ignora cliques (evita o envio duplo)', async () => {
    const aoClicar = vi.fn()
    render(
      <Botao carregando onClick={aoClicar}>
        Entrando
      </Botao>,
    )
    const botao = screen.getByRole('button', { name: 'Entrando' })

    await userEvent.click(botao)

    expect(botao).toHaveAttribute('aria-busy', 'true')
    expect(botao).toBeDisabled()
    expect(aoClicar).not.toHaveBeenCalled()
  })

  it('pode ocupar a largura toda, como nos formulários de entrada', () => {
    render(<Botao larguraTotal>Entrar</Botao>)

    expect(screen.getByRole('button')).toHaveClass('hub-botao--largura-total')
  })
})
