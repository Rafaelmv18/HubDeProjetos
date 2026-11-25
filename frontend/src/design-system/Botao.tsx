import type { ComponentProps } from 'react'
import './Botao.css'

// Aceita tudo o que um <button> comum aceita (onClick, disabled, type...),
// mais as três opções do design system.
type Props = ComponentProps<'button'> & {
  // Aparência. Use no máximo um "primario" por área da tela.
  variante?: 'padrao' | 'primario' | 'fantasma' | 'perigo'
  // Mostra o giro de "aguarde" e ignora cliques enquanto a ação acontece
  carregando?: boolean
  // Ocupa a largura toda do lugar onde está (formulários de entrada)
  larguraTotal?: boolean
}

// O botão do design system (docs/design-system.html, seção "Ações")
export function Botao({
  variante = 'padrao',
  carregando = false,
  larguraTotal = false,
  // Sem isto, um <button> dentro de um <form> envia o formulário ao clicar.
  // Quem quer enviar pede type="submit" de propósito.
  type = 'button',
  disabled,
  className,
  children,
  ...resto
}: Props) {
  const classes = [
    'hub-botao',
    variante !== 'padrao' && `hub-botao--${variante}`,
    larguraTotal && 'hub-botao--largura-total',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      {...resto}
      type={type}
      className={classes}
      // Carregando também desabilita: o segundo clique não repete a ação
      disabled={disabled || carregando}
      aria-busy={carregando || undefined}
    >
      {carregando && (
        <svg
          className="hub-botao__giro"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <path d="M20.5 12A8.5 8.5 0 1 1 12 3.5" />
        </svg>
      )}
      {children}
    </button>
  )
}
