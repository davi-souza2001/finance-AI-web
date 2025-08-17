import { useMutation, useQueryClient } from '@tanstack/react-query'
import Cookies from 'js-cookie'
import type { DeleteItemRequest } from './types/itemType'

export function useDeleteItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: DeleteItemRequest) => {
      const token = Cookies.get('auth-finance-ai-web')

      await fetch(`http://localhost:3333/items/${data.itemId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      })
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-items-by-user'] })
    },
  })
}
