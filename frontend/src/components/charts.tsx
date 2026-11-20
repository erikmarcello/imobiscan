import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { moeda, moedaCurta } from '../format'
import type { BairroStats, Tendencia } from '../types'

const eixo = { stroke: '#64748b', fontSize: 12 }
const tooltip = {
  contentStyle: { background: '#111a2e', border: '1px solid #1e2a44', borderRadius: 8 },
  labelStyle: { color: '#e2e8f0' },
}

export function M2PorBairro({ dados }: { dados: BairroStats[] }) {
  return (
    <ResponsiveContainer width="100%" height={Math.max(220, dados.length * 34)}>
      <BarChart data={dados} layout="vertical" margin={{ left: 20, right: 20 }}>
        <CartesianGrid stroke="#1e2a44" horizontal={false} />
        <XAxis type="number" tickFormatter={moedaCurta} {...eixo} />
        <YAxis type="category" dataKey="bairro" width={120} {...eixo} />
        <Tooltip {...tooltip} formatter={(v) => [moeda(Number(v)), 'Mediana R$/m²']} />
        <Bar dataKey="preco_m2_mediano" fill="#22c55e" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

const mesCurto = (m: string) => {
  const [ano, mes] = m.split('-')
  return `${mes}/${ano.slice(2)}`
}

export function TendenciaChart({ dados }: { dados: Tendencia['serie'] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={dados} margin={{ left: 10, right: 20, top: 10 }}>
        <CartesianGrid stroke="#1e2a44" />
        <XAxis dataKey="mes" tickFormatter={mesCurto} {...eixo} />
        <YAxis tickFormatter={moedaCurta} {...eixo} width={80} domain={['auto', 'auto']} />
        <Tooltip {...tooltip} labelFormatter={(m) => mesCurto(String(m))} formatter={(v) => [moeda(Number(v)), 'R$/m²']} />
        <Line type="monotone" dataKey="preco_m2_indice" stroke="#f59e0b" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  )
}
