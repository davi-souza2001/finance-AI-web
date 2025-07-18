import { useQuery } from '@tanstack/react-query'
import type { CreateItemResponse } from './types/itemType'

export function useGetItemsByUser(userID: string) {
  return useQuery({
    queryKey: ['get-items-by-user', userID],
    queryFn: async () => {
      const response = await fetch(
        `http://localhost:3333/items/${userID}`
      )
      const result: CreateItemResponse[] = await response.json()

      return result
    },
  })
}
