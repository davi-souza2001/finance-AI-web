import { useQuery } from '@tanstack/react-query'
import Cookies from 'js-cookie'
import type { CreateCategoryResponse } from './types/categorieType'

export function useGetCategories() {
  return useQuery({
    queryKey: ['get-categories'],
    queryFn: async () => {
      const token = Cookies.get('auth-finance-ai-web')

      const response = await fetch('http://localhost:3333/categories', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const result: CreateCategoryResponse[] = await response.json()

      return result
    },
  })
}
