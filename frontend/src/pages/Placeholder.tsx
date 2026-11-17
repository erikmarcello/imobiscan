import { Card } from '../components/Card'
import PageHeader from '../components/PageHeader'

export default function Placeholder({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <>
      <PageHeader title={title} subtitle={subtitle} />
      <Card>
        <p className="text-sm text-slate-400">Em breve.</p>
      </Card>
    </>
  )
}
