
import { IconTrendingDown, IconTrendingUp } from '@tabler/icons-react'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import type { ItemProps } from '@/http/types/itemType'
import type { User } from '@/http/types/userType'

type RecommendationCardProps = {
  items: ItemProps[]
  user: User
}

export function RecommendationCard({ items, user }: RecommendationCardProps) {
  const totalSpent = items?.reduce((acc, item) => acc + item.value, 0) ?? 0
  const monthlySpending = user.monthlySpending
  const expectationRepresentation = (totalSpent / monthlySpending) * 100
  const mountAvailable = monthlySpending - totalSpent

  const renderExpectationMonthly = () => {
    switch (expectationRepresentation >= 50) {
      case true: {
        return (
          <span className="flex items-center justify-center gap-1 text-red-200 text-xs">
            {expectationRepresentation}%
            <IconTrendingDown />
          </span>
        )
      }

      case false: {
        return (
          <span className='flex items-center justify-center gap-1 text-emerald-200 text-xs'>
            {expectationRepresentation}%
            <IconTrendingUp />
          </span>
        )
      }
    }
  }

  return (
    <Card className="@container/card w-96">
      <CardHeader>
        <CardDescription>Available</CardDescription>
        <CardTitle className="font-semibold @[250px]/card:text-3xl text-2xl tabular-nums">
          R$ {mountAvailable.toFixed(2).replace('.', ',')}
        </CardTitle>
        <CardAction>
          <Badge variant="outline">
            {renderExpectationMonthly()}
          </Badge>
        </CardAction>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        <div className="line-clamp-1 flex gap-2 font-medium">
          {mountAvailable > 0 ? (
            <p className="flex gap-2">
              Trending up this month <IconTrendingUp className="size-4" />
            </p>
          ) : (
            <p className="flex gap-2">
              Trending down this month <IconTrendingDown className="size-4" />
            </p>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}
