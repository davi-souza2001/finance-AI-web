import { Header } from '@/components/header'
import { columns } from '@/components/payments/columns'
import { DataTable } from '@/components/payments/data-table'
import { RecommendationCard } from '@/components/sections-cards/recommendation-card'
import { TotalExpenseCard } from '@/components/sections-cards/total-expense-card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useGetCategories } from '@/http/use-get-categories'
import { useGetItemsByUser } from '@/http/use-get-items'
import { useUserStore } from '@/store/useUserStore'

export function InitialPage() {
  const { user } = useUserStore()
  const { data: categories } = useGetCategories()
  const { data: items } = useGetItemsByUser(user?.id ?? '')

  const itemsCategoriesTransformed = items?.map((item) => {
    const category = categories?.find((cat) => cat.id === item.categoryId)
    return {
      ...item,
      category: category?.name,
    }
  })

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-start gap-4">
        <Header />
        <Tabs className="items-start" defaultValue="finances">
          <TabsList className="h-auto w-full justify-start rounded-none border-b bg-transparent p-0">
            <TabsTrigger
              className='data-[state=active]:!bg-transparent data-[state=active]:!border-transparent relative w-52 flex-none cursor-pointer rounded-none py-2 outline-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:shadow-none data-[state=active]:after:bg-primary'
              value="finances"
            >
              Finances
            </TabsTrigger>
            <TabsTrigger
              className='data-[state=active]:!bg-transparent data-[state=active]:!border-transparent relative w-52 flex-none cursor-pointer rounded-none py-2 outline-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:shadow-none data-[state=active]:after:bg-primary'
              value="investment"
            >
              Investment
            </TabsTrigger>
          </TabsList>
          <TabsContent value="finances">
            <div className="mx-auto flex w-6xl flex-col items-start justify-start gap-4">
              <div className="flex w-full items-center justify-start gap-4">
                <TotalExpenseCard items={items ?? []} />
                <RecommendationCard items={items ?? []} user={user} />
              </div>
              <DataTable columns={columns} data={itemsCategoriesTransformed ?? []} />
            </div>
          </TabsContent>
          <TabsContent value="investment">
            <div className="mx-auto flex max-w-6xl flex-col items-start justify-start gap-4">
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
