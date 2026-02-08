import { useMutation } from '@tanstack/react-query'
import Cookies from 'js-cookie'
import type { ItemsPropsResponse } from './types/itemType'

export function useGenerateItem() {
  return useMutation({
    mutationFn: async (data: FormData) => {
      const token = Cookies.get('auth-finance-ai-web')

      const response = await fetch('http://localhost:3333/transactions/generate-ia-transaction', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: data,
      })

      if (!response.ok) {
        throw new Error('Erro ao gerar item')
      }

      const result = await response.json()
      const transactions: ItemsPropsResponse[] = result.transactions

      return transactions
    },
  })
}
