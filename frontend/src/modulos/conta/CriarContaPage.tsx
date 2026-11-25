import { LayoutEntrada } from '../../compartilhado/LayoutEntrada'
import { Aviso } from '../../design-system/Aviso'

// Tela /criar-conta (wireframe 1). Por enquanto só a moldura, as abas e o
// título: o formulário de nome, e-mail e senha chega na US01.
export function CriarContaPage() {
  return (
    <LayoutEntrada titulo="Criar sua conta" comAbas>
      <Aviso tipo="info">
        O formulário de criar conta ainda está em construção.
      </Aviso>
    </LayoutEntrada>
  )
}
