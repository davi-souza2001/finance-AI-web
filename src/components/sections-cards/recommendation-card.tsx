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
import type { CreateItemResponse } from '@/http/types/itemType'
import type { User } from '@/http/types/userType'

type RecommendationCardProps = {
  items: CreateItemResponse[]
  user: User | null
}

export function RecommendationCard({ items, user }: RecommendationCardProps) {
  const totalSpent = items?.reduce((acc, item) => acc + item.price, 0) ?? 0
  const totalIncome = typeof user?.id === 'number' ? user.id : 1000

  const remainingMonth = totalIncome - totalSpent
  const percentageToZero =
    totalIncome > 0 ? (remainingMonth / totalIncome) * 100 : 0

  return (
    <Card className="@container/card w-96">
      <CardHeader>
        <CardDescription>Recommended Expenditure</CardDescription>
        <CardTitle className="font-semibold @[250px]/card:text-3xl text-2xl tabular-nums">
          R$ {remainingMonth.toFixed(2).replace('.', ',')}
        </CardTitle>
        <CardAction>
          <Badge variant="outline">
            {percentageToZero !== 0 ? (
              <span className='flex items-center justify-center gap-1 text-emerald-200 text-xs'>
                {percentageToZero.toFixed(2)}%
                <IconTrendingUp />
              </span>
            ) : (
              <span className="flex items-center justify-center gap-1 text-red-200 text-xs">
                {percentageToZero.toFixed(2)}%
                <IconTrendingDown />
              </span>
            )}
          </Badge>
        </CardAction>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        <div className="line-clamp-1 flex gap-2 font-medium">
          {remainingMonth > 0 ? (
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
