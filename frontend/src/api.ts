import type { Imovel, ImovelInput } from './types'

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`/api${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.detail ?? `Erro ${res.status}`)
  }
  return res.status === 204 ? (undefined as T) : res.json()
}

export type Filtros = { bairro?: string; tipo?: string; quartos_min?: number; preco_max?: number; busca?: string }

function query(filtros: Filtros) {
  const params = new URLSearchParams()
  Object.entries(filtros).forEach(([k, v]) => {
    if (v !== undefined && v !== '' && v !== null) params.set(k, String(v))
  })
  const s = params.toString()
  return s ? `?${s}` : ''
}

export const api = {
  listarImoveis: (filtros: Filtros = {}) => request<Imovel[]>(`/imoveis${query(filtros)}`),
  criarImovel: (dados: ImovelInput) => request<Imovel>('/imoveis', { method: 'POST', body: JSON.stringify(dados) }),
  atualizarImovel: (id: number, dados: ImovelInput) =>
    request<Imovel>(`/imoveis/${id}`, { method: 'PUT', body: JSON.stringify(dados) }),
  removerImovel: (id: number) => request<void>(`/imoveis/${id}`, { method: 'DELETE' }),
  bairros: () => request<string[]>('/bairros'),
}
