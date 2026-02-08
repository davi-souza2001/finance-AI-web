import { useQuery } from '@tanstack/react-query'
import Cookies from 'js-cookie'
import type { ItemProps, ItemsPropsResponse } from './types/itemType'

export type PaginationInfo = {
  currentPage: number
  totalPages?: number
  totalItems?: number
  hasNextPage?: boolean
  hasPreviousPage?: boolean
}

export type ItemsResponse = {
  items: ItemProps[]
  pagination: PaginationInfo
}

export function useGetItemsByUser(page = 1) {
  return useQuery({
    queryKey: ['get-items-by-user', page],
    queryFn: async () => {
      const token = Cookies.get('auth-finance-ai-web')

      const response = await fetch(
        `http://localhost:3333/transactions?page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      const apiResult = await response.json()
      const transactionsRaw: ItemsPropsResponse[] = apiResult.transactions || []
      const transaction: ItemProps[] = transactionsRaw.map((item) => {
        const itemResult: ItemProps = {
          id: item._id.value,
          title: item.props.title,
          category: item.props.category,
          value: item.props.value,
          description: item.props?.description,
          createdAt: item.props?.createdAt,
          updatedAt: item.props?.updatedAt,
        }

        return itemResult
      })

      // Extrair informações de paginação da resposta da API, se disponíveis
      const pagination: PaginationInfo = {
        currentPage: apiResult.currentPage ?? page,
        totalPages: apiResult.totalPages,
        totalItems: apiResult.totalItems,
        hasNextPage: apiResult.hasNextPage ?? (apiResult.totalPages ? page < apiResult.totalPages : transactionsRaw.length > 0),
        hasPreviousPage: apiResult.hasPreviousPage ?? page > 1,
      }

      return {
        items: transaction,
        pagination,
      }
    },
    staleTime: 1000 * 60 * 60 * 24, // 24 hours,
    gcTime: 1000 * 60 * 60 * 24, // 24 hours,
  })
}
