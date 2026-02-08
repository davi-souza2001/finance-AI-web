import { useMutation, useQueryClient } from '@tanstack/react-query'
import Cookies from 'js-cookie'
import type { ItemProps } from './types/itemType'

export function useCreateItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: ItemProps) => {
      const token = Cookies.get('auth-finance-ai-web')

      await fetch('http://localhost:3333/transactions', {
        method: 'POST',
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
