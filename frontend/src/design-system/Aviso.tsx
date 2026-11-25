import type { ReactNode } from 'react'
import './Aviso.css'

type Tipo = 'info' | 'atencao' | 'perigo' | 'sucesso'

type Props = {
  tipo: Tipo
  children: ReactNode
}

// O desenho de cada ícone (os mesmos de docs/design-system.html).
// A cor nunca é o único sinal: cada tipo tem também o seu ícone.
const ICONES: Record<Tipo, ReactNode> = {
  info: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 11v5.5M12 7.7v.1" />
    </>
  ),
  atencao: <path d="M12 4 2.8 20h18.4ZM12 10v4.5M12 17.3v.1" />,
  perigo: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V13M12 16.3v.1" />
    </>
  ),
  sucesso: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="m8 12.3 2.8 2.8L16 9.5" />
    </>
  ),
}

// A faixa de mensagem (docs/design-system.html, "Avisos e estados"),
// como "E-mail ou senha inválidos."
export function Aviso({ tipo, children }: Props) {
  return (
    <div
      className={`hub-aviso hub-aviso--${tipo}`}
      // "alert" interrompe o leitor de tela para anunciar o erro na hora.
      // "status" anuncia quando a pessoa terminar o que está ouvindo.
      role={tipo === 'perigo' ? 'alert' : 'status'}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {ICONES[tipo]}
      </svg>
      <span>{children}</span>
    </div>
  )
}
