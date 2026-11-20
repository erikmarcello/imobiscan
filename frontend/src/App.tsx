import { useState } from 'react'
import Sidebar, { type PageKey } from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Imoveis from './pages/Imoveis'
import Mercado from './pages/Mercado'
import Placeholder from './pages/Placeholder'

export default function App() {
  const [page, setPage] = useState<PageKey>('dashboard')

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <Sidebar current={page} onChange={setPage} />
      <main className="flex-1 overflow-y-auto p-6 md:p-8">
        {page === 'dashboard' && <Dashboard />}
        {page === 'imoveis' && <Imoveis />}
        {page === 'mercado' && <Mercado />}
        {page === 'oportunidades' && <Placeholder title="Oportunidades" subtitle="Imóveis abaixo dos comparáveis" />}
        {page === 'simulador' && <Placeholder title="Simulador financeiro" subtitle="Entrada, parcelas e custos" />}
      </main>
    </div>
  )
}
