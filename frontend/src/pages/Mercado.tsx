import { useEffect, useState } from 'react'
import { api } from '../api'
import { Card } from '../components/Card'
import { M2PorBairro, TendenciaChart } from '../components/charts'
import PageHeader from '../components/PageHeader'
import { moeda } from '../format'
import { TIPOS, type BairroStats, type Tendencia } from '../types'

const campo = 'rounded-lg border border-line bg-ink px-3 py-2 text-sm text-white outline-none focus:border-brand'

export default function Mercado() {
  const [tipo, setTipo] = useState('')
  const [bairro, setBairro] = useState('')
  const [stats, setStats] = useState<BairroStats[]>([])
  const [tendencia, setTendencia] = useState<Tendencia | null>(null)

  useEffect(() => {
    api.mercadoBairros(tipo || undefined).then(setStats)
  }, [tipo])

  useEffect(() => {
    api.tendencia(bairro || undefined).then(setTendencia)
  }, [bairro])

  const variacao = tendencia?.variacao_pct ?? 0

  return (
    <>
      <PageHeader title="Análise de mercado" subtitle="Preço por m², valorização e comparação por bairro" />

      <div className="grid gap-6 xl:grid-cols-2">
        <Card title="Mediana do R$/m² por bairro">
          <select className={`${campo} mb-4`} value={tipo} onChange={(e) => setTipo(e.target.value)}>
            <option value="">Todos os tipos</option>
            {TIPOS.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
          <M2PorBairro dados={stats} />
        </Card>

        <Card title="Valorização (últimos 12 meses)">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <select className={campo} value={bairro} onChange={(e) => setBairro(e.target.value)}>
              <option value="">Todos os bairros</option>
              {stats.map((s) => (
                <option key={s.bairro}>{s.bairro}</option>
              ))}
            </select>
            <span className={`text-lg font-bold ${variacao >= 0 ? 'text-brand' : 'text-red-400'}`}>
              {variacao >= 0 ? '+' : ''}
              {variacao.toLocaleString('pt-BR')}%
            </span>
          </div>
          {tendencia && <TendenciaChart dados={tendencia.serie} />}
          <p className="mt-3 text-xs text-slate-500">
            Índice mensal: cada anúncio é comparado com a mediana do seu bairro, para a mistura de bairros não distorcer a curva.
          </p>
        </Card>
      </div>

      <Card title="Comparação por bairro" className="mt-6">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="text-xs uppercase text-slate-500">
              <tr className="border-b border-line">
                <th className="py-2 pr-3">Bairro</th>
                <th className="py-2 pr-3 text-right">Anúncios</th>
                <th className="py-2 pr-3 text-right">Preço médio</th>
                <th className="py-2 pr-3 text-right">Mediana R$/m²</th>
                <th className="py-2 text-right">Faixa R$/m²</th>
              </tr>
            </thead>
            <tbody>
              {stats.map((s) => (
                <tr key={s.bairro} className="border-b border-line/60">
                  <td className="py-3 pr-3 font-medium text-white">{s.bairro}</td>
                  <td className="py-3 pr-3 text-right text-slate-300">{s.quantidade}</td>
                  <td className="py-3 pr-3 text-right text-slate-300">{moeda(s.preco_medio)}</td>
                  <td className="py-3 pr-3 text-right font-medium text-white">{moeda(s.preco_m2_mediano)}</td>
                  <td className="py-3 text-right text-slate-400">
                    {moeda(s.preco_m2_min)} – {moeda(s.preco_m2_max)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  )
}
