import { useMutation } from '@tanstack/react-query'
import Cookies from 'js-cookie'
import type { GenerateItemRequest, GenerateItemResponse } from './types/itemType'

export function useGenerateItem() {
  return useMutation({
    mutationFn: async (data: GenerateItemRequest) => {
      const token = Cookies.get('auth-finance-ai-web')

      const response = await fetch('http://localhost:3333/items/generate', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      
      if (!response.ok) {
        throw new Error('Erro ao gerar item')
      }
      
      const result: GenerateItemResponse = await response.json()
      return result
    },
  })
}
