import { NavLink } from 'react-router'
import './Abas.css'

type Item = {
  // O texto da aba
  rotulo: string
  // O endereço que a aba abre (ex.: "/entrar")
  para: string
}

type Props = {
  // O nome do conjunto, lido pelo leitor de tela (não aparece na tela)
  rotulo: string
  itens: Item[]
}

// Abas que trocam de tela (docs/design-system.html, seção "Navegação").
// Cada aba é um link de verdade: tem endereço próprio, funciona com o
// botão voltar do navegador e pode ser aberta em outra aba.
export function Abas({ rotulo, itens }: Props) {
  return (
    <nav className="hub-abas" aria-label={rotulo}>
      {itens.map((item) => (
        // O NavLink compara o endereço atual com o "to" e, quando são
        // iguais, coloca aria-current="page" sozinho. O CSS usa esse
        // atributo para destacar a aba aberta.
        <NavLink key={item.para} to={item.para} className="hub-abas__aba" end>
          {item.rotulo}
        </NavLink>
      ))}
    </nav>
  )
}
