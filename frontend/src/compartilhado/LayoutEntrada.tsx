import type { CSSProperties, ReactNode } from 'react'
import { Abas } from '../design-system/Abas'
import { Marca } from '../design-system/Marca'
import { Orbitas } from '../design-system/Orbitas'
import './LayoutEntrada.css'

type Props = {
  // O título da tela: "Entrar na sua conta", "Recuperar senha"...
  titulo: string
  // Mostra as abas "Entrar | Criar conta" acima do título (wireframe 1).
  // A tela de recuperar senha, por exemplo, não usa.
  comAbas?: boolean
  // O conteúdo da tela (o formulário)
  children: ReactNode
}

// A mesma frase da abertura da landing page
const FRASE = 'Todo o trabalho do seu setor em um só lugar.'

// As duas telas entre as quais as abas alternam
const ABAS = [
  { rotulo: 'Entrar', para: '/entrar' },
  { rotulo: 'Criar conta', para: '/criar-conta' },
]

// A moldura das telas de entrada (wireframe 1): o painel da marca de um
// lado e o conteúdo da tela do outro. Cada tela só entrega o título e o
// conteúdo, e o painel não precisa ser repetido em cada uma.
//
// O painel é vitrine da marca e segue o movimento da landing page
// (anéis, órbitas, avisos flutuando). O resto do app continua sóbrio.
export function LayoutEntrada({ titulo, comAbas = false, children }: Props) {
  return (
    <div className="hub-entrada">
      <aside
        className="hub-entrada__painel"
        aria-label="Sobre o Hub de Projetos"
      >
        <Marca />

        <div className="hub-entrada__apresentacao">
          {/* É um parágrafo, e não um título: o título da página é o da tela.
              Cada palavra vira um <span> para entrar na sua vez (--i é a
              posição da palavra, que o CSS usa para calcular o atraso). */}
          <p className="hub-entrada__frase">
            {FRASE.split(' ').map((palavra, i) => (
              <span key={i}>
                <span
                  className="hub-entrada__palavra"
                  style={{ '--i': i } as CSSProperties}
                >
                  {palavra}
                </span>{' '}
              </span>
            ))}
          </p>
          <p className="hub-entrada__apoio">
            Tarefas, arquivos e reuniões sem trocar de ferramenta. E cada pessoa
            vê exatamente o que o cargo e o grupo permitem.
          </p>
        </div>

        {/* Enfeite: os anéis, a equipe em órbita e dois avisos de exemplo.
            aria-hidden esconde tudo do leitor de tela, porque não são
            avisos de verdade. */}
        <div className="hub-entrada__cena" aria-hidden="true">
          <Orbitas />
          <div className="hub-entrada__flutuante hub-entrada__flutuante--a">
            <span className="hub-entrada__quem hub-entrada__quem--c2">FA</span>
            <span>
              <b>Fábio</b> comentou em “Coletar dados”
            </span>
          </div>
          <div className="hub-entrada__flutuante hub-entrada__flutuante--b">
            <span className="hub-entrada__quem hub-entrada__quem--c3">LI</span>
            <span>
              <b>Lia</b> concluiu “Relatório parcial”
            </span>
          </div>
        </div>
      </aside>

      <main className="hub-entrada__conteudo">
        <div className="hub-entrada__coluna">
          {comAbas && <Abas rotulo="Entrar ou criar conta" itens={ABAS} />}
          <h1 className="hub-entrada__titulo">{titulo}</h1>
          {children}
        </div>
      </main>
    </div>
  )
}
