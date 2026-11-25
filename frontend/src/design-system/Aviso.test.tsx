import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Aviso } from './Aviso'

describe('Aviso', () => {
  it('mostra a mensagem', () => {
    render(<Aviso tipo="info">Você pode mudar o nome depois.</Aviso>)

    expect(screen.getByText('Você pode mudar o nome depois.')).toBeVisible()
  })

  it('de perigo é anunciado na hora pelo leitor de tela', () => {
    render(<Aviso tipo="perigo">E-mail ou senha inválidos.</Aviso>)

    // role="alert" interrompe a leitura para anunciar a mensagem
    expect(screen.getByRole('alert')).toHaveTextContent(
      'E-mail ou senha inválidos.',
    )
  })

  it.each(['info', 'atencao', 'sucesso'] as const)(
    'de %s é anunciado sem interromper',
    (tipo) => {
      render(<Aviso tipo={tipo}>Mensagem</Aviso>)

      // role="status" espera a pessoa terminar o que está ouvindo
      expect(screen.getByRole('status')).toHaveTextContent('Mensagem')
    },
  )

  it.each(['info', 'atencao', 'perigo', 'sucesso'] as const)(
    'de %s tem cor e ícone próprios (a cor nunca é o único sinal)',
    (tipo) => {
      const { container } = render(<Aviso tipo={tipo}>Mensagem</Aviso>)

      expect(container.firstElementChild).toHaveClass(`hub-aviso--${tipo}`)
      expect(container.querySelector('svg')).toHaveAttribute(
        'aria-hidden',
        'true',
      )
    },
  )
})
