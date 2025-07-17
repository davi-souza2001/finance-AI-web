import { Header } from '@/components/header'
import { columns, type Payment } from '@/components/payments/columns'
import { DataTable } from '@/components/payments/data-table'
import { SectionCard } from '@/components/section-card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

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
      <Header />
        <Tabs defaultValue="finances">
          <TabsList className='mb-5 w-full'>
            <TabsTrigger value="finances">Finances</TabsTrigger>
            <TabsTrigger value="investment">Investment</TabsTrigger>
          </TabsList>
          <TabsContent value="finances">
            <div className='mx-auto flex max-w-6xl flex-col items-start justify-start gap-4'>
              <div className="flex w-full items-center justify-start gap-4">
                <SectionCard />
                <SectionCard />
                <SectionCard />
              </div>
              <DataTable columns={columns} data={data} />
            </div>
          </TabsContent>
          <TabsContent value="investment">
            <div className='mx-auto flex max-w-6xl flex-col items-start justify-start gap-4'>
              <div className="w-[72rem]">
                <p>Soon...</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
