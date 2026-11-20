export type Imovel = {
  id: number
  titulo: string
  bairro: string
  tipo: string
  area_m2: number
  quartos: number
  vagas: number
  preco: number
  condominio: number
  iptu: number
  lat: number | null
  lng: number | null
  anunciado_em: string
  descricao: string
  preco_m2: number
}

export type ImovelInput = Omit<Imovel, 'id' | 'preco_m2' | 'anunciado_em'> & { anunciado_em?: string }

export const TIPOS = ['Apartamento', 'Casa', 'Cobertura', 'Sala comercial']

export type Resumo = {
  total: number
  preco_medio: number
  preco_m2_medio: number
  area_media: number
  bairros: number
}

export type BairroStats = {
  bairro: string
  quantidade: number
  preco_medio: number
  preco_m2_medio: number
  preco_m2_mediano: number
  preco_m2_min: number
  preco_m2_max: number
}

export type Tendencia = {
  serie: { mes: string; preco_m2_indice: number; anuncios: number }[]
  variacao_pct: number
}
