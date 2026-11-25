import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ErroApi, api } from './api'

// O teste não chama a API de verdade: o fetch do navegador é trocado por um falso.

const CSRF = '/api/sanctum/csrf-cookie'

function json(status: number, corpo: unknown) {
  return new Response(JSON.stringify(corpo), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

// Grava o cookie como o Laravel faz (valor codificado para URL)
function gravaCookie(valor: string) {
  document.cookie = `XSRF-TOKEN=${valor}; path=/`
}

function apagaCookie() {
  document.cookie = 'XSRF-TOKEN=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/'
}

// Cria o fetch falso. A rota do csrf-cookie grava o cookie, como o servidor
// faria. As outras chamadas devolvem, em ordem, as respostas informadas.
function fetchComRespostas(...respostas: Response[]) {
  // O segundo parâmetro não é usado aqui, mas precisa existir no tipo
  // para os testes poderem conferir as opções de cada chamada.
  const fetchFalso = vi.fn((url: string, _opcoes?: RequestInit) => {
    if (url === CSRF) {
      gravaCookie('token-novo')
      return Promise.resolve(new Response(null, { status: 204 }))
    }
    const resposta = respostas.shift()
    if (!resposta) throw new Error('Chamada a mais do que o esperado')
    return Promise.resolve(resposta)
  })
  vi.stubGlobal('fetch', fetchFalso)
  return fetchFalso
}

// Só os endereços chamados, na ordem
function urls(fetchFalso: ReturnType<typeof fetchComRespostas>) {
  return fetchFalso.mock.calls.map(([url]) => url)
}

// Os cabeçalhos da última chamada
function cabecalhos(fetchFalso: ReturnType<typeof fetchComRespostas>) {
  const opcoes = fetchFalso.mock.lastCall?.[1] as RequestInit
  return opcoes.headers as Record<string, string>
}

beforeEach(() => {
  apagaCookie()
})

afterEach(() => {
  vi.unstubAllGlobals()
  apagaCookie()
})

describe('api', () => {
  it('GET chama /api + caminho com Accept e credentials e devolve o JSON', async () => {
    const fetchFalso = fetchComRespostas(json(200, { banco: 'ok' }))

    const resultado = await api.get<{ banco: string }>('/saude')

    expect(resultado).toEqual({ banco: 'ok' })
    expect(fetchFalso).toHaveBeenCalledTimes(1)
    const [url, opcoes] = fetchFalso.mock.calls[0] as [string, RequestInit]
    expect(url).toBe('/api/saude')
    expect(opcoes.credentials).toBe('same-origin')
    expect(cabecalhos(fetchFalso).Accept).toBe('application/json')
  })

  it('GET não busca o cookie de CSRF nem envia X-XSRF-TOKEN', async () => {
    const fetchFalso = fetchComRespostas(json(200, {}))

    await api.get('/saude')

    expect(urls(fetchFalso)).toEqual(['/api/saude'])
    expect(cabecalhos(fetchFalso)).not.toHaveProperty('X-XSRF-TOKEN')
  })

  it('POST sem cookie busca o csrf-cookie antes de fazer a chamada', async () => {
    const fetchFalso = fetchComRespostas(json(201, { id: 1 }))

    await api.post('/projetos', { nome: 'A' })

    expect(urls(fetchFalso)).toEqual([CSRF, '/api/projetos'])
    const [, opcoes] = fetchFalso.mock.calls[0] as [string, RequestInit]
    expect(opcoes.credentials).toBe('same-origin')
    // O cookie gravado pelo csrf-cookie é o que vai no cabeçalho
    expect(cabecalhos(fetchFalso)['X-XSRF-TOKEN']).toBe('token-novo')
  })

  it('POST com o cookie já presente não busca de novo e envia o valor decodificado', async () => {
    gravaCookie('abc%3D')
    const fetchFalso = fetchComRespostas(json(200, {}))

    await api.post('/projetos', {})

    expect(urls(fetchFalso)).toEqual(['/api/projetos'])
    expect(cabecalhos(fetchFalso)['X-XSRF-TOKEN']).toBe('abc=')
  })

  it('POST envia o corpo como JSON com Content-Type application/json', async () => {
    gravaCookie('abc')
    const fetchFalso = fetchComRespostas(json(200, {}))

    await api.post('/projetos', { nome: 'Hub' })

    const [, opcoes] = fetchFalso.mock.calls[0] as [string, RequestInit]
    expect(opcoes.method).toBe('POST')
    expect(opcoes.body).toBe(JSON.stringify({ nome: 'Hub' }))
    expect(cabecalhos(fetchFalso)['Content-Type']).toBe('application/json')
  })

  it('chamada sem corpo não envia body nem Content-Type', async () => {
    gravaCookie('abc')
    const fetchFalso = fetchComRespostas(json(200, {}))

    await api.post('/projetos/1/arquivar')

    const [, opcoes] = fetchFalso.mock.calls[0] as [string, RequestInit]
    expect(opcoes.body).toBeUndefined()
    expect(cabecalhos(fetchFalso)).not.toHaveProperty('Content-Type')
  })

  it.each([
    ['PUT', () => api.put('/projetos/1', {})],
    ['PATCH', () => api.patch('/projetos/1', {})],
    ['DELETE', () => api.delete('/projetos/1')],
  ])('%s também envia o X-XSRF-TOKEN', async (metodo, chamar) => {
    gravaCookie('abc%3D')
    const fetchFalso = fetchComRespostas(json(200, {}))

    await chamar()

    const [, opcoes] = fetchFalso.mock.calls[0] as [string, RequestInit]
    expect(opcoes.method).toBe(metodo)
    expect(cabecalhos(fetchFalso)['X-XSRF-TOKEN']).toBe('abc=')
  })

  it('204 devolve undefined', async () => {
    gravaCookie('abc')
    fetchComRespostas(new Response(null, { status: 204 }))

    await expect(api.delete('/projetos/1')).resolves.toBeUndefined()
  })

  it('422 lança ErroApi com a mensagem e os erros por campo', async () => {
    gravaCookie('abc')
    fetchComRespostas(
      json(422, {
        message: 'Dados inválidos.',
        errors: { email: ['E-mail inválido.'] },
      }),
    )

    const erro = await api.post('/login', {}).catch((e: unknown) => e)

    expect(erro).toBeInstanceOf(ErroApi)
    expect(erro).toMatchObject({
      status: 422,
      message: 'Dados inválidos.',
      erros: { email: ['E-mail inválido.'] },
    })
  })

  it('401 lança ErroApi com status 401 e erros vazio', async () => {
    fetchComRespostas(json(401, { message: 'Unauthenticated.' }))

    const erro = await api.get('/eu').catch((e: unknown) => e)

    expect(erro).toBeInstanceOf(ErroApi)
    expect(erro).toMatchObject({ status: 401, erros: {} })
  })

  it('erro com corpo que não é JSON lança ErroApi sem estourar erro de parse', async () => {
    fetchComRespostas(
      new Response('<html>Erro interno</html>', {
        status: 500,
        headers: { 'Content-Type': 'text/html' },
      }),
    )

    const erro = await api.get('/saude').catch((e: unknown) => e)

    expect(erro).toBeInstanceOf(ErroApi)
    expect(erro).toMatchObject({ status: 500, erros: {} })
    expect((erro as ErroApi).message).not.toBe('')
  })

  it('419 no POST busca o cookie de novo e repete a chamada uma vez', async () => {
    gravaCookie('vencido')
    const fetchFalso = fetchComRespostas(
      json(419, { message: 'CSRF token mismatch.' }),
      json(200, { ok: true }),
    )

    const resultado = await api.post('/projetos', {})

    expect(resultado).toEqual({ ok: true })
    expect(urls(fetchFalso)).toEqual(['/api/projetos', CSRF, '/api/projetos'])
    // A repetição usa o cookie novo
    expect(cabecalhos(fetchFalso)['X-XSRF-TOKEN']).toBe('token-novo')
  })

  it('419 duas vezes lança ErroApi 419 e não tenta uma terceira vez', async () => {
    gravaCookie('vencido')
    const fetchFalso = fetchComRespostas(
      json(419, { message: 'CSRF token mismatch.' }),
      json(419, { message: 'CSRF token mismatch.' }),
    )

    const erro = await api.post('/projetos', {}).catch((e: unknown) => e)

    expect(erro).toBeInstanceOf(ErroApi)
    expect(erro).toMatchObject({ status: 419 })
    expect(urls(fetchFalso)).toEqual(['/api/projetos', CSRF, '/api/projetos'])
  })

  it('falha de rede lança ErroApi com status 0', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => Promise.reject(new TypeError('Failed to fetch'))),
    )

    const erro = await api.get('/saude').catch((e: unknown) => e)

    expect(erro).toBeInstanceOf(ErroApi)
    expect(erro).toMatchObject({
      status: 0,
      message: 'Não foi possível falar com o servidor.',
      erros: {},
    })
  })
})
