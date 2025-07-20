import { useQuery } from '@tanstack/react-query'
import Cookies from 'js-cookie'
import type { User } from './types/userType'

export function useGetUserById(userID: string) {
  return useQuery({
    queryKey: ['get-user-by-id', userID],
    queryFn: async () => {
      const token = Cookies.get('auth-finance-ai-web')

      const response = await fetch(
        `http://localhost:3333/get-user-by-id/${userID}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      const result: User = await response.json()

      return result
    },
  })
}
