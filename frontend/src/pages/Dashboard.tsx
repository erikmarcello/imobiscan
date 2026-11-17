import { Card, Stat } from '../components/Card'
import PageHeader from '../components/PageHeader'

export default function Dashboard() {
  return (
    <>
      <PageHeader title="Dashboard" subtitle="Visão geral do mercado e das oportunidades" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Imóveis cadastrados" value="—" />
        <Stat label="Preço médio" value="—" />
        <Stat label="Preço médio por m²" value="—" />
        <Stat label="Oportunidades" value="—" />
      </div>
      <Card title="Em construção" className="mt-6">
        <p className="text-sm text-slate-400">Os indicadores aparecem aqui assim que a API de imóveis estiver pronta.</p>
      </Card>
    </>
  )
}
