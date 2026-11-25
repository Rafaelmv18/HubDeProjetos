import type { CSSProperties } from 'react'
import { SimboloDaMarca } from './Marca'
import './Orbitas.css'

// A ilustração das telas de entrada, a mesma ideia da abertura da landing:
// o Hub no centro, um ANEL para cada cargo e a equipe girando em volta.

// Os anéis, do centro para fora. "atraso" faz cada um surgir depois do anterior.
const ANEIS = [
  { tamanho: 200, atraso: 0 },
  { tamanho: 380, atraso: 90 },
  { tamanho: 560, atraso: 180 },
  { tamanho: 760, atraso: 270 },
  { tamanho: 980, atraso: 360 },
]

// Cada pessoa gira em um anel. "volta" é o tempo de uma volta completa e
// "inicio" (negativo) faz a animação começar no meio do caminho, para as
// pessoas já aparecerem espalhadas. "cor" é a cor de presença (1 a 6).
const PESSOAS = [
  {
    sigla: 'AN',
    cor: 1,
    tamanho: 380,
    volta: 60,
    inicio: -44,
    aoContrario: false,
  },
  {
    sigla: 'FA',
    cor: 2,
    tamanho: 560,
    volta: 80,
    inicio: -10,
    aoContrario: false,
  },
  {
    sigla: 'LI',
    cor: 3,
    tamanho: 560,
    volta: 80,
    inicio: -52,
    aoContrario: true,
  },
  {
    sigla: 'GA',
    cor: 4,
    tamanho: 760,
    volta: 110,
    inicio: -18,
    aoContrario: true,
  },
  {
    sigla: 'DI',
    cor: 5,
    tamanho: 760,
    volta: 110,
    inicio: -84,
    aoContrario: false,
  },
]

// O CSS lê estes valores com var(--tamanho), var(--atraso) etc.
// O "as CSSProperties" avisa o TypeScript que variáveis de CSS são permitidas aqui.
function variaveis(valores: Record<string, string>) {
  return valores as CSSProperties
}

export function Orbitas() {
  return (
    // aria-hidden: é enfeite. O leitor de tela pula tudo isto.
    <div className="hub-orbitas" aria-hidden="true">
      {ANEIS.map(({ tamanho, atraso }) => (
        <i
          key={tamanho}
          className="hub-orbitas__anel"
          style={variaveis({
            '--tamanho': `${tamanho}px`,
            '--atraso': `${atraso}ms`,
          })}
        />
      ))}

      {PESSOAS.map(({ sigla, cor, tamanho, volta, inicio, aoContrario }) => (
        <div
          key={sigla}
          className={
            aoContrario
              ? 'hub-orbitas__orbita hub-orbitas__orbita--ao-contrario'
              : 'hub-orbitas__orbita'
          }
          style={variaveis({
            '--tamanho': `${tamanho}px`,
            '--volta': `${volta}s`,
            '--inicio': `${inicio}s`,
          })}
        >
          <span className={`hub-orbitas__avatar hub-orbitas__avatar--c${cor}`}>
            {sigla}
          </span>
        </div>
      ))}

      <SimboloDaMarca className="hub-orbitas__centro" />
    </div>
  )
}
