const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })
const num = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 })

export const moeda = (v: number) => brl.format(v)
export const numero = (v: number) => num.format(v)
export const moedaCurta = (v: number) => {
  if (v >= 1_000_000) return `R$ ${num.format(v / 1_000_000)} mi`
  if (v >= 1_000) return `R$ ${num.format(v / 1_000)} mil`
  return brl.format(v)
}
