import { useId } from 'react'
import type { ComponentProps } from 'react'
import './Campo.css'

// Aceita tudo o que um <input> comum aceita (type, name, value, onChange...),
// mais o rótulo, a dica e o erro.
type Props = ComponentProps<'input'> & {
  // O texto acima da caixa. Todo campo tem um rótulo visível.
  rotulo: string
  // Texto de ajuda, abaixo da caixa
  dica?: string
  // Mensagem de erro. Quando existe, toma o lugar da dica.
  erro?: string
}

// Um campo de formulário completo (docs/design-system.html, "Formulários"):
// rótulo em cima, caixa de texto no meio, dica ou erro embaixo.
export function Campo({ rotulo, dica, erro, className, ...resto }: Props) {
  // useId cria um identificador único para cada campo da tela. É ele que
  // liga o rótulo e a mensagem à caixa certa, mesmo com vários campos.
  const id = useId()
  const idDaMensagem = `${id}-mensagem`
  const temMensagem = Boolean(erro || dica)

  return (
    <div className={['hub-campo', className].filter(Boolean).join(' ')}>
      <label htmlFor={id}>{rotulo}</label>
      <input
        {...resto}
        id={id}
        className="hub-campo__caixa"
        // Avisa o leitor de tela que o valor não foi aceito
        aria-invalid={erro ? true : undefined}
        // Faz o leitor de tela ler a dica ou o erro junto com o campo
        aria-describedby={temMensagem ? idDaMensagem : undefined}
      />
      {erro ? (
        <span className="hub-campo__erro" id={idDaMensagem}>
          {/* O ícone acompanha a cor: a cor nunca é o único sinal de erro */}
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="8.5" />
            <path d="M12 7.5V13M12 16.3v.1" />
          </svg>
          {erro}
        </span>
      ) : (
        dica && (
          <span className="hub-campo__dica" id={idDaMensagem}>
            {dica}
          </span>
        )
      )}
    </div>
  )
}
