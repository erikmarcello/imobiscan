import { useCallback, useEffect, useState } from 'react'
import { api, type Filtros } from '../api'
import { Card } from '../components/Card'
import ImovelForm from '../components/ImovelForm'
import PageHeader from '../components/PageHeader'
import { moeda, numero } from '../format'
import { TIPOS, type Imovel, type ImovelInput } from '../types'

const campo = 'rounded-lg border border-line bg-ink px-3 py-2 text-sm text-white outline-none focus:border-brand'

export default function Imoveis() {
  const [imoveis, setImoveis] = useState<Imovel[]>([])
  const [bairros, setBairros] = useState<string[]>([])
  const [filtros, setFiltros] = useState<Filtros>({})
  const [editando, setEditando] = useState<Imovel | null | undefined>(undefined)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  const carregar = useCallback(async () => {
    setCarregando(true)
    try {
      setImoveis(await api.listarImoveis(filtros))
      setErro('')
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Erro ao carregar')
    } finally {
      setCarregando(false)
    }
  }, [filtros])

  useEffect(() => {
    carregar()
  }, [carregar])

  useEffect(() => {
    api.bairros().then(setBairros).catch(() => {})
  }, [])

  async function salvar(dados: ImovelInput) {
    if (editando) await api.atualizarImovel(editando.id, dados)
    else await api.criarImovel(dados)
    setEditando(undefined)
    carregar()
    api.bairros().then(setBairros)
  }

  async function remover(imovel: Imovel) {
    if (!confirm(`Remover "${imovel.titulo}"?`)) return
    await api.removerImovel(imovel.id)
    carregar()
  }

  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <PageHeader title="Imóveis" subtitle="Cadastrar, editar e pesquisar propriedades" />
        <button onClick={() => setEditando(null)} className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-ink hover:brightness-110">
          + Novo imóvel
        </button>
      </div>

      <Card className="mb-6">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <input className={campo} placeholder="Buscar pelo título" onChange={(e) => setFiltros((f) => ({ ...f, busca: e.target.value }))} />
          <select className={campo} onChange={(e) => setFiltros((f) => ({ ...f, bairro: e.target.value || undefined }))}>
            <option value="">Todos os bairros</option>
            {bairros.map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>
          <select className={campo} onChange={(e) => setFiltros((f) => ({ ...f, tipo: e.target.value || undefined }))}>
            <option value="">Todos os tipos</option>
            {TIPOS.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
          <select className={campo} onChange={(e) => setFiltros((f) => ({ ...f, quartos_min: e.target.value ? Number(e.target.value) : undefined }))}>
            <option value="">Quartos</option>
            {[1, 2, 3, 4].map((q) => (
              <option key={q} value={q}>
                {q}+ quartos
              </option>
            ))}
          </select>
          <input
            className={campo}
            type="number"
            placeholder="Preço máximo"
            onChange={(e) => setFiltros((f) => ({ ...f, preco_max: e.target.value ? Number(e.target.value) : undefined }))}
          />
        </div>
      </Card>

      {erro && <p className="mb-4 text-sm text-red-400">{erro}</p>}

      <Card title={carregando ? 'Carregando…' : `${imoveis.length} imóveis`}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="text-xs uppercase text-slate-500">
              <tr className="border-b border-line">
                <th className="py-2 pr-3">Imóvel</th>
                <th className="py-2 pr-3">Bairro</th>
                <th className="py-2 pr-3 text-right">Área</th>
                <th className="py-2 pr-3 text-right">Preço</th>
                <th className="py-2 pr-3 text-right">R$/m²</th>
                <th className="py-2" />
              </tr>
            </thead>
            <tbody>
              {imoveis.map((i) => (
                <tr key={i.id} className="border-b border-line/60 hover:bg-line/40">
                  <td className="py-3 pr-3">
                    <p className="font-medium text-white">{i.titulo}</p>
                    <p className="text-xs text-slate-500">
                      {i.tipo} · {i.quartos} qts · {i.vagas} vagas
                    </p>
                  </td>
                  <td className="py-3 pr-3 text-slate-300">{i.bairro}</td>
                  <td className="py-3 pr-3 text-right text-slate-300">{numero(i.area_m2)} m²</td>
                  <td className="py-3 pr-3 text-right font-medium text-white">{moeda(i.preco)}</td>
                  <td className="py-3 pr-3 text-right text-slate-300">{moeda(i.preco_m2)}</td>
                  <td className="py-3 text-right">
                    <button onClick={() => setEditando(i)} className="mr-2 text-xs text-slate-400 hover:text-white">
                      Editar
                    </button>
                    <button onClick={() => remover(i)} className="text-xs text-red-400/80 hover:text-red-400">
                      Remover
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {editando !== undefined && (
        <ImovelForm inicial={editando ?? undefined} bairros={bairros} onSalvar={salvar} onCancelar={() => setEditando(undefined)} />
      )}
    </>
  )
}
