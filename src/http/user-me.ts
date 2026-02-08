import { useQuery } from '@tanstack/react-query'
import Cookies from 'js-cookie'
import type { User } from './types/userType'

export function useGetMe() {
  return useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const token = Cookies.get('auth-finance-ai-web')

      const response = await fetch(
        `http://localhost:3333/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      const result = await response.json()

      const user: User = result.props

      return user
    },
  })
}
