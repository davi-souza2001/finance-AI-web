import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import type { ItemProps } from '@/http/types/itemType'

type TotalExpenseCardProps = {
  items: ItemProps[]
}

export function TotalExpenseCard({ items }: TotalExpenseCardProps) {
  const totalSpent = items?.reduce((acc, item) => acc + item.value, 0) ?? 0

  return (
    <Card className="@container/card w-96">
      <CardHeader>
        <CardDescription>Total Spent</CardDescription>
        <CardTitle className="font-semibold @[250px]/card:text-3xl text-2xl tabular-nums">
          R$ {totalSpent.toFixed(2).replace('.', ',')}
        </CardTitle>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        <div className="text-muted-foreground">
          There were a total of {items?.length} expenses this month.
        </div>
      </CardFooter>
    </Card>
  )
}
