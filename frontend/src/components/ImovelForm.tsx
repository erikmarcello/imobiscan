import { useState, type FormEvent } from 'react'
import { TIPOS, type Imovel, type ImovelInput } from '../types'

type Props = {
  inicial?: Imovel
  bairros: string[]
  onSalvar: (dados: ImovelInput) => Promise<void>
  onCancelar: () => void
}

const vazio: ImovelInput = {
  titulo: '',
  bairro: '',
  tipo: 'Apartamento',
  area_m2: 0,
  quartos: 2,
  vagas: 1,
  preco: 0,
  condominio: 0,
  iptu: 0,
  lat: null,
  lng: null,
  descricao: '',
}

const input = 'w-full rounded-lg border border-line bg-ink px-3 py-2 text-sm text-white outline-none focus:border-brand'

export default function ImovelForm({ inicial, bairros, onSalvar, onCancelar }: Props) {
  const [dados, setDados] = useState<ImovelInput>(inicial ?? vazio)
  const [erro, setErro] = useState('')
  const [salvando, setSalvando] = useState(false)

  const set = <K extends keyof ImovelInput>(campo: K, valor: ImovelInput[K]) => setDados((d) => ({ ...d, [campo]: valor }))
  const n = (v: string) => (v === '' ? 0 : Number(v))

  async function enviar(e: FormEvent) {
    e.preventDefault()
    setErro('')
    setSalvando(true)
    try {
      await onSalvar(dados)
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'Não foi possível salvar')
    } finally {
      setSalvando(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 p-4">
      <form onSubmit={enviar} className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-line bg-panel p-6">
        <h2 className="mb-5 text-lg font-semibold text-white">{inicial ? 'Editar imóvel' : 'Novo imóvel'}</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="sm:col-span-2">
            <span className="mb-1 block text-xs text-slate-400">Título</span>
            <input className={input} required value={dados.titulo} onChange={(e) => set('titulo', e.target.value)} />
          </label>
          <label>
            <span className="mb-1 block text-xs text-slate-400">Bairro</span>
            <input className={input} required list="bairros" value={dados.bairro} onChange={(e) => set('bairro', e.target.value)} />
            <datalist id="bairros">
              {bairros.map((b) => (
                <option key={b} value={b} />
              ))}
            </datalist>
          </label>
          <label>
            <span className="mb-1 block text-xs text-slate-400">Tipo</span>
            <select className={input} value={dados.tipo} onChange={(e) => set('tipo', e.target.value)}>
              {TIPOS.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </label>
          <label>
            <span className="mb-1 block text-xs text-slate-400">Preço (R$)</span>
            <input className={input} type="number" min={1} required value={dados.preco || ''} onChange={(e) => set('preco', n(e.target.value))} />
          </label>
          <label>
            <span className="mb-1 block text-xs text-slate-400">Área (m²)</span>
            <input className={input} type="number" min={1} required value={dados.area_m2 || ''} onChange={(e) => set('area_m2', n(e.target.value))} />
          </label>
          <label>
            <span className="mb-1 block text-xs text-slate-400">Quartos</span>
            <input className={input} type="number" min={0} value={dados.quartos} onChange={(e) => set('quartos', n(e.target.value))} />
          </label>
          <label>
            <span className="mb-1 block text-xs text-slate-400">Vagas</span>
            <input className={input} type="number" min={0} value={dados.vagas} onChange={(e) => set('vagas', n(e.target.value))} />
          </label>
          <label>
            <span className="mb-1 block text-xs text-slate-400">Condomínio (R$/mês)</span>
            <input className={input} type="number" min={0} value={dados.condominio || ''} onChange={(e) => set('condominio', n(e.target.value))} />
          </label>
          <label>
            <span className="mb-1 block text-xs text-slate-400">IPTU (R$/mês)</span>
            <input className={input} type="number" min={0} value={dados.iptu || ''} onChange={(e) => set('iptu', n(e.target.value))} />
          </label>
          <label className="sm:col-span-2">
            <span className="mb-1 block text-xs text-slate-400">Descrição</span>
            <textarea className={input} rows={3} value={dados.descricao} onChange={(e) => set('descricao', e.target.value)} />
          </label>
        </div>
        {erro && <p className="mt-4 text-sm text-red-400">{erro}</p>}
        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={onCancelar} className="rounded-lg px-4 py-2 text-sm text-slate-300 hover:bg-line">
            Cancelar
          </button>
          <button disabled={salvando} className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-ink hover:brightness-110 disabled:opacity-50">
            {salvando ? 'Salvando…' : 'Salvar'}
          </button>
        </div>
      </form>
    </div>
  )
}
