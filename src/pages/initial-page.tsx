import { columns, type Payment } from '@/components/payments/columns'
import { DataTable } from '@/components/payments/data-table'
import { SectionCard } from '@/components/section-card'

export function InitialPage() {
  const data: Payment[] = [
    {
      id: '728ed52f',
      amount: 100,
      status: 'pending',
      description: 'm@example.com',
      name: 'John Doe',
      category: 'Food',
    },
    {
      id: '489e1d42',
      amount: 125,
      status: 'processing',
      description: 'example@gmail.com',
      name: 'Jane Doe',
      category: 'Food',
    },
  ]

  return (
    <div className="min-h-screen px-4 py-8">
      <div className='mx-auto flex max-w-6xl flex-col items-start justify-start gap-4'>
        <div className="flex w-full items-center justify-start gap-4">
          <SectionCard />
          <SectionCard />
          <SectionCard />
        </div>
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  )
}
