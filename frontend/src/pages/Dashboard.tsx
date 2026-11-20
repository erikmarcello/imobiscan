import { useEffect, useState } from 'react'
import { api } from '../api'
import { Card, Stat } from '../components/Card'
import { M2PorBairro, TendenciaChart } from '../components/charts'
import PageHeader from '../components/PageHeader'
import { moeda, moedaCurta, numero } from '../format'
import type { BairroStats, Resumo, Tendencia } from '../types'

export default function Dashboard() {
  const [resumo, setResumo] = useState<Resumo | null>(null)
  const [bairros, setBairros] = useState<BairroStats[]>([])
  const [tendencia, setTendencia] = useState<Tendencia | null>(null)

  useEffect(() => {
    api.resumo().then(setResumo)
    api.mercadoBairros().then(setBairros)
    api.tendencia().then(setTendencia)
  }, [])

  return (
    <>
      <PageHeader title="Dashboard" subtitle="Visão geral do mercado e das oportunidades" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Imóveis cadastrados" value={resumo ? numero(resumo.total) : '—'} hint={resumo ? `${resumo.bairros} bairros` : undefined} />
        <Stat label="Preço médio" value={resumo ? moedaCurta(resumo.preco_medio) : '—'} />
        <Stat label="Preço médio por m²" value={resumo ? moeda(resumo.preco_m2_medio) : '—'} />
        <Stat
          label="Valorização 12 meses"
          value={tendencia ? `${tendencia.variacao_pct >= 0 ? '+' : ''}${tendencia.variacao_pct.toLocaleString('pt-BR')}%` : '—'}
        />
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Card title="Bairros mais caros (R$/m²)">
          <M2PorBairro dados={bairros.slice(0, 6)} />
        </Card>
        <Card title="Tendência do R$/m²">{tendencia && <TendenciaChart dados={tendencia.serie} />}</Card>
      </div>
    </>
  )
}
