import './Marca.css'

type PropsDoSimbolo = {
  // Quem usa escolhe o tamanho por uma classe de CSS
  className?: string
}

// Só o desenho da roda, sem o nome. As cores são sempre as da marca.
// A fatia amarela é um grupo; o centro é quem enxerga tudo.
export function SimboloDaMarca({ className }: PropsDoSimbolo) {
  return (
    // aria-hidden: é desenho. Onde o nome importa, ele está escrito ao lado.
    <svg className={className} viewBox="0 0 32 32" aria-hidden="true">
      <circle className="hub-marca__disco" cx="16" cy="16" r="15" />
      <path
        className="hub-marca__fatia"
        d="M16 16 5.4 5.4A15 15 0 0 1 26.6 5.4Z"
      />
      <circle className="hub-marca__centro" cx="16" cy="16" r="4.5" />
    </svg>
  )
}

// O logotipo do Hub: a roda (o desenho) e o nome
export function Marca() {
  return (
    <span className="hub-marca">
      <SimboloDaMarca className="hub-marca__simbolo" />
      Hub de Projetos
    </span>
  )
}
