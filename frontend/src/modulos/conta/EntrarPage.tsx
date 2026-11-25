import { LayoutEntrada } from '../../compartilhado/LayoutEntrada'
import { Aviso } from '../../design-system/Aviso'

// Tela /entrar (wireframe 1). Por enquanto só a moldura, as abas e o
// título: o formulário de e-mail e senha chega na US02.
export function EntrarPage() {
  return (
    <LayoutEntrada titulo="Entrar na sua conta" comAbas>
      <Aviso tipo="info">
        O formulário de entrada ainda está em construção.
      </Aviso>
    </LayoutEntrada>
  )
}
