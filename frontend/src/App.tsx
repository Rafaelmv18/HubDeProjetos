import { Navigate, Route, Routes } from 'react-router'
import { CriarContaPage } from './modulos/conta/CriarContaPage'
import { EntrarPage } from './modulos/conta/EntrarPage'
import { SaudePage } from './modulos/sistema/SaudePage'

// A tabela de rotas: qual endereço abre qual tela (React Router, D43).
// Quem acompanha a barra de endereço é o BrowserRouter, no main.tsx.
function App() {
  return (
    <Routes>
      <Route path="/entrar" element={<EntrarPage />} />
      <Route path="/criar-conta" element={<CriarContaPage />} />
      {/* Página técnica: mostra se a API e o banco estão no ar */}
      <Route path="/saude" element={<SaudePage />} />
      {/* A raiz e qualquer endereço desconhecido levam para a entrada.
          "replace" troca o endereço errado no histórico, e o botão voltar
          do navegador não fica preso nele. */}
      <Route path="*" element={<Navigate to="/entrar" replace />} />
    </Routes>
  )
}

export default App
