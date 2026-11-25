// Preparação dos testes: roda antes de cada arquivo de teste.

// Adiciona matchers como toBeInTheDocument() ao expect do Vitest
import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// Sem "globals", a limpeza automática não existe: fazemos aqui.
// Remove o que o teste anterior desenhou na tela.
afterEach(() => {
  cleanup()
})
