import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { CreateItemRequest } from './types/itemType'

export function useCreateItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateItemRequest) => {
      await fetch('http://localhost:3333/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-items-by-user'] })
    },
  })
}
