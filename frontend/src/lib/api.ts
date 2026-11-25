// Cliente HTTP do front-end: todo o contato com a API (Laravel) passa por aqui.

// Erro lançado quando a API (ou a rede) não dá uma resposta de sucesso.
export class ErroApi extends Error {
  // Código HTTP. É 0 quando a rede falhou e nem houve resposta.
  status: number
  // Erros de validação por campo (422 do Laravel). Vazio nos outros casos.
  erros: Record<string, string[]>

  constructor(
    status: number,
    message: string,
    erros: Record<string, string[]> = {},
  ) {
    super(message)
    this.name = 'ErroApi'
    this.status = status
    this.erros = erros
  }
}

const NOME_COOKIE_CSRF = 'XSRF-TOKEN'
const CAMINHO_COOKIE_CSRF = '/api/sanctum/csrf-cookie'

// Lê o token de CSRF que o Laravel guarda no cookie (ou undefined se não há)
function lerTokenCsrf(): string | undefined {
  const par = document.cookie
    .split('; ')
    .find((cookie) => cookie.startsWith(`${NOME_COOKIE_CSRF}=`))
  // O Laravel grava o valor codificado para URL (ex.: "=" vira "%3D")
  return par && decodeURIComponent(par.slice(NOME_COOKIE_CSRF.length + 1))
}

// Chama o fetch e transforma a falha de rede (a Promise rejeita) em ErroApi
async function enviar(url: string, opcoes: RequestInit): Promise<Response> {
  try {
    return await fetch(url, { ...opcoes, credentials: 'same-origin' })
  } catch {
    throw new ErroApi(0, 'Não foi possível falar com o servidor.')
  }
}

// Pede ao Laravel que grave o cookie XSRF-TOKEN no navegador
async function buscarCookieCsrf(): Promise<void> {
  await enviar(CAMINHO_COOKIE_CSRF, { headers: { Accept: 'application/json' } })
}

// Monta o ErroApi a partir de uma resposta que não é 2xx
async function montarErro(resposta: Response): Promise<ErroApi> {
  let corpo: { message?: unknown; errors?: unknown } = {}
  try {
    corpo = (await resposta.json()) as typeof corpo
  } catch {
    // Corpo que não é JSON (ex.: página HTML de erro 500): usa o texto genérico
  }
  const mensagem =
    typeof corpo?.message === 'string' && corpo.message !== ''
      ? corpo.message
      : 'Algo deu errado. Tente novamente.'
  const erros = (corpo?.errors ?? {}) as Record<string, string[]>
  return new ErroApi(resposta.status, mensagem, erros)
}

async function requisicao<T>(
  metodo: string,
  caminho: string,
  corpo?: unknown,
  podeRepetir = true,
): Promise<T> {
  const alteraDados = metodo !== 'GET'

  // Sem o cookie não há token para enviar: busca antes (só em quem altera dados)
  if (alteraDados && !lerTokenCsrf()) await buscarCookieCsrf()

  const cabecalhos: Record<string, string> = { Accept: 'application/json' }
  const token = alteraDados ? lerTokenCsrf() : undefined
  if (token) cabecalhos['X-XSRF-TOKEN'] = token
  if (corpo !== undefined) cabecalhos['Content-Type'] = 'application/json'

  const resposta = await enviar(`/api${caminho}`, {
    method: metodo,
    headers: cabecalhos,
    body: corpo === undefined ? undefined : JSON.stringify(corpo),
  })

  // 419 = token de CSRF vencido: renova o cookie e tenta de novo, uma vez só
  if (resposta.status === 419 && alteraDados && podeRepetir) {
    await buscarCookieCsrf()
    return requisicao<T>(metodo, caminho, corpo, false)
  }

  if (!resposta.ok) throw await montarErro(resposta)

  // 204 = sucesso sem corpo: não há JSON para ler
  if (resposta.status === 204) return undefined as T
  return (await resposta.json()) as T
}

// O caminho começa com "/" e o "/api" é colocado na frente: api.get('/saude')
export const api = {
  get: <T>(caminho: string) => requisicao<T>('GET', caminho),
  post: <T>(caminho: string, corpo?: unknown) =>
    requisicao<T>('POST', caminho, corpo),
  put: <T>(caminho: string, corpo?: unknown) =>
    requisicao<T>('PUT', caminho, corpo),
  patch: <T>(caminho: string, corpo?: unknown) =>
    requisicao<T>('PATCH', caminho, corpo),
  delete: <T>(caminho: string) => requisicao<T>('DELETE', caminho),
}
