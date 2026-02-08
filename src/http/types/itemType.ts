export enum TransactionCategories {
  FOOD = 'FOOD',
  TRANSPORT = 'TRANSPORT',
  ENTERTAINMENT = 'ENTERTAINMENT',
  HEALTH = 'HEALTH',
  EDUCATION = 'EDUCATION',
  HOUSING = 'HOUSING',
  SALARY = 'SALARY',
  OTHER = 'OTHER',
}

export type ItemProps = {
  id?: string
  title: string
  description?: string
  value: number
  category: TransactionCategories
  createdAt?: string
  updatedAt?: string
}

export type ItemsPropsResponse = {
  "_id": {
    value: string
  },
  props: {
    title: string,
    description: string,
    userId: string,
    value: number,
    category: TransactionCategories,
    createdAt: string,
    updatedAt: string
  }
}

export type DeleteItemRequest = {
  itemId: string
}