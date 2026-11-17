export type PageKey = 'dashboard' | 'imoveis' | 'mercado' | 'oportunidades' | 'simulador'

const items: { key: PageKey; label: string; icon: string }[] = [
  { key: 'dashboard', label: 'Dashboard', icon: '▦' },
  { key: 'imoveis', label: 'Imóveis', icon: '⌂' },
  { key: 'mercado', label: 'Mercado', icon: '▲' },
  { key: 'oportunidades', label: 'Oportunidades', icon: '◎' },
  { key: 'simulador', label: 'Simulador', icon: '∑' },
]

type Props = { current: PageKey; onChange: (key: PageKey) => void }

export default function Sidebar({ current, onChange }: Props) {
  return (
    <aside className="flex w-full shrink-0 flex-row gap-1 overflow-x-auto border-b border-line bg-panel p-3 md:h-screen md:w-60 md:flex-col md:border-b-0 md:border-r">
      <div className="mb-0 mr-4 flex items-center gap-2 px-2 md:mb-6 md:mr-0 md:py-2">
        <img src="/favicon.svg" alt="" className="h-8 w-8" />
        <span className="text-lg font-bold tracking-tight text-white">ImobiScan</span>
      </div>
      {items.map((item) => (
        <button
          key={item.key}
          onClick={() => onChange(item.key)}
          className={`flex items-center gap-3 whitespace-nowrap rounded-lg px-3 py-2 text-left text-sm font-medium transition ${
            current === item.key ? 'bg-brand/15 text-brand' : 'text-slate-400 hover:bg-line hover:text-white'
          }`}
        >
          <span className="w-4 text-center">{item.icon}</span>
          {item.label}
        </button>
      ))}
    </aside>
  )
}
