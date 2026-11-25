import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Marca, SimboloDaMarca } from './Marca'

describe('Marca', () => {
  it('mostra o nome do sistema', () => {
    render(<Marca />)

    expect(screen.getByText('Hub de Projetos')).toBeInTheDocument()
  })

  it('esconde o desenho do leitor de tela, porque o nome já diz tudo', () => {
    const { container } = render(<Marca />)

    expect(container.querySelector('svg')).toHaveAttribute(
      'aria-hidden',
      'true',
    )
  })
})

describe('SimboloDaMarca', () => {
  it('é só o desenho da roda, sem o nome', () => {
    const { container } = render(<SimboloDaMarca />)

    expect(container.querySelector('svg')).toBeInTheDocument()
    expect(container).not.toHaveTextContent('Hub de Projetos')
  })

  it('aceita uma classe, para quem usa escolher o tamanho', () => {
    const { container } = render(<SimboloDaMarca className="grande" />)

    expect(container.querySelector('svg')).toHaveClass('grande')
  })
})
