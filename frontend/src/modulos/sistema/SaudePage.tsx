import { useEffect, useState } from 'react'

// As três situações possíveis da página. Com este tipo, o TypeScript
// só deixa ler "banco" quando a fase é 'respondeu'.
type Estado =
  | { fase: 'carregando' }
  | { fase: 'respondeu'; banco: string }
  | { fase: 'falhou' }

// Página inicial provisória: pergunta à API se ela e o banco estão no ar.
export function SaudePage() {
  const [estado, setEstado] = useState<Estado>({ fase: 'carregando' })

  // O useEffect com [] roda uma vez, quando a página aparece
  useEffect(() => {
    // Evita mexer no estado se a página já saiu da tela
    let ativo = true

    fetch('/api/saude')
      // A API responde JSON tanto no 200 (ok) quanto no 503 (banco fora)
      .then((resposta) => resposta.json())
      .then((corpo: { banco?: unknown }) => {
        if (typeof corpo.banco !== 'string') {
          throw new Error('Resposta inesperada da API')
        }
        if (ativo) setEstado({ fase: 'respondeu', banco: corpo.banco })
      })
      // Cai aqui se a rede falhou ou se a resposta não era o esperado
      .catch(() => {
        if (ativo) setEstado({ fase: 'falhou' })
      })

    return () => {
      ativo = false
    }
  }, [])

  return (
    <main>
      <h1>Hub de Projetos</h1>
      {estado.fase === 'carregando' && <p>Carregando…</p>}
      {estado.fase === 'respondeu' && <p>{`banco: ${estado.banco}`}</p>}
      {estado.fase === 'falhou' && <p>Não foi possível falar com a API.</p>}
    </main>
  )
}
