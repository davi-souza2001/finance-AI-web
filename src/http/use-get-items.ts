import { useQuery } from '@tanstack/react-query'
import Cookies from 'js-cookie'
import type { ItemProps, ItemsPropsResponse } from './types/itemType'

export function useGetItemsByUser() {
  return useQuery({
    queryKey: ['get-items-by-user'],
    queryFn: async () => {
      const token = Cookies.get('auth-finance-ai-web')

      const response = await fetch(
        "http://localhost:3333/transactions?page=1",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      const result = await response.json()
      const transactionsRaw: ItemsPropsResponse[] = result.transactions
      const transaction: ItemProps[] = transactionsRaw.map((item) => {
        const result: ItemProps = {
          id: item._id.value,
          title: item.props.title,
          category: item.props.category,
          value: item.props.value,
          description: item.props?.description,
          createdAt: item.props?.createdAt,
          updatedAt: item.props?.updatedAt,
        }

        return result
      })

      return transaction
    },
    staleTime: 1000 * 60 * 60 * 24, // 24 hours,
    gcTime: 1000 * 60 * 60 * 24, // 24 hours,
  })
}
