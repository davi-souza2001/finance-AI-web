import { useMutation } from '@tanstack/react-query'
import type { LoginRequest } from './types/loginType'

export function useLogin() {
   return useMutation({
    mutationFn: async (data: LoginRequest) => {
      await fetch('http://localhost:3333/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
    },
  })
}
