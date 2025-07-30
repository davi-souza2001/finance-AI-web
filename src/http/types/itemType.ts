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
  category?: string
}

export type GenerateItemResponse = {
  itemId: string
}

export type GenerateItemRequest = {
  image: string
}