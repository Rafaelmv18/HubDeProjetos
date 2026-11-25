import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Orbitas } from './Orbitas'

describe('Orbitas', () => {
  it('é só ilustração: fica escondida do leitor de tela', () => {
    const { container } = render(<Orbitas />)

    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true')
  })

  it('desenha os cinco anéis, um para cada cargo', () => {
    const { container } = render(<Orbitas />)

    // Do centro para fora: proprietário, administrador, líder, membro, convidado
    expect(container.querySelectorAll('.hub-orbitas__anel')).toHaveLength(5)
  })

  it('coloca a equipe em órbita em volta do símbolo do Hub', () => {
    const { container } = render(<Orbitas />)

    const avatares = [
      ...container.querySelectorAll('.hub-orbitas__avatar'),
    ].map((avatar) => avatar.textContent)
    expect(avatares).toEqual(['AN', 'FA', 'LI', 'GA', 'DI'])
    expect(container.querySelector('.hub-orbitas__centro')).toBeInTheDocument()
  })
})
