import { useMutation } from '@tanstack/react-query'
import type { LoginRequest } from './types/loginType'

export function useLogin() {
   return useMutation({
    mutationFn: async (data: LoginRequest) => {
     const response = await fetch('http://localhost:3333/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const body = await response.json()

      return body
    },
  })
}
