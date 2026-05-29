import { PageHeader } from '@/components/shared/PageHeader'
import { Button } from '@/components/ui/button'

export default function LeadsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Leads"
        subtitle="Gerencie seus contatos e oportunidades"
        action={<Button>Novo Lead</Button>}
      />

      <div className="rounded-lg border border-gray-800 bg-gray-900 p-8 text-center text-sm text-gray-600">
        Tabela de leads — em breve (M4)
      </div>
    </div>
  )
}
