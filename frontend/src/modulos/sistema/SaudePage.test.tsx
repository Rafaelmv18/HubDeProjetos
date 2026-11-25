import { render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { SaudePage } from './SaudePage'

// O teste não chama a API de verdade. Estas funções trocam o fetch do
// navegador por um falso, que devolve a resposta escolhida em cada teste.

function apiResponde(status: number, corpo: unknown) {
  const fetchFalso = vi.fn(() =>
    Promise.resolve(
      new Response(JSON.stringify(corpo), {
        status,
        headers: { 'Content-Type': 'application/json' },
      }),
    ),
  )
  vi.stubGlobal('fetch', fetchFalso)
  return fetchFalso
}

function apiNuncaResponde() {
  // Uma Promise que nunca termina: a página fica esperando para sempre
  vi.stubGlobal(
    'fetch',
    vi.fn(() => new Promise<Response>(() => {})),
  )
}

function apiInalcancavel() {
  // É assim que o fetch falha quando a rede cai ou a API está desligada
  vi.stubGlobal(
    'fetch',
    vi.fn(() => Promise.reject(new TypeError('Failed to fetch'))),
  )
}

// Devolve o fetch verdadeiro depois de cada teste
afterEach(() => {
  vi.unstubAllGlobals()
})

describe('SaudePage', () => {
  it('mostra "Carregando…" enquanto a API não responde', () => {
    apiNuncaResponde()

    render(<SaudePage />)

    expect(screen.getByText('Carregando…')).toBeInTheDocument()
  })

  it('mostra "banco: ok" quando a API responde que está tudo certo', async () => {
    const fetchFalso = apiResponde(200, { status: 'ok', banco: 'ok' })

    render(<SaudePage />)

    // findByText espera o texto aparecer (a resposta chega depois)
    expect(await screen.findByText('banco: ok')).toBeInTheDocument()
    expect(screen.queryByText('Carregando…')).not.toBeInTheDocument()
    expect(fetchFalso).toHaveBeenCalledWith('/api/saude')
  })

  it('mostra "banco: fora do ar" quando a API responde 503', async () => {
    apiResponde(503, { status: 'erro', banco: 'fora do ar' })

    render(<SaudePage />)

    expect(await screen.findByText('banco: fora do ar')).toBeInTheDocument()
  })

  it('avisa quando a resposta da API vem sem o campo "banco"', async () => {
    // A API respondeu, mas não no formato combinado
    apiResponde(200, { status: 'ok' })

    render(<SaudePage />)

    expect(
      await screen.findByText('Não foi possível falar com a API.'),
    ).toBeInTheDocument()
  })

  it('avisa quando não consegue falar com a API', async () => {
    apiInalcancavel()

    render(<SaudePage />)

    expect(
      await screen.findByText('Não foi possível falar com a API.'),
    ).toBeInTheDocument()
  })
})
