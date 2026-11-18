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
