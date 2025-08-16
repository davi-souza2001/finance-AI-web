import { useQuery } from '@tanstack/react-query'
import Cookies from 'js-cookie'
import type { CreateItemResponse } from './types/itemType'

export function useGetItemsByUser(userID: string) {
  return useQuery({
    queryKey: ['get-items-by-user', userID],
    queryFn: async () => {
      const token = Cookies.get('auth-finance-ai-web')

      const response = await fetch(
        `http://localhost:3333/items/${userID}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      const result: CreateItemResponse[] = await response.json()

      return result
    },
    staleTime: 1000 * 60 * 60 * 24, // 24 hours,
    gcTime: 1000 * 60 * 60 * 24, // 24 hours,
  })
}
