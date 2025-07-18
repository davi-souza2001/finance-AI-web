export type CreateItemRequest = {
  name: string
  description: string
  categoryId: string
  userId: string
  price: number
}

export type CreateItemResponse = {
  name: string
  description: string
  categoryId: string
  userId: string
  price: number
  id?: string
  createdAt?: string
}