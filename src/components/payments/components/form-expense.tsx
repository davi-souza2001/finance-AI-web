import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { DialogClose, DialogFooter } from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { useCreateItem } from '@/http/use-create-item'
import { useGetCategories } from '@/http/use-get-categories'
import { useUserStore } from '@/store/useUserStore'

const createItemSchema = z.object({
  name: z.string().min(3, { message: 'Inclua no mínimo 3 caracteres' }),
  description: z.string(),
  categoryId: z.string().min(1, { message: 'Selecione uma categoria' }),
  price: z.coerce.number().min(1, { message: 'Inclua um valor' }),
})

type CreateItemFormData = z.infer<typeof createItemSchema>

export function FormExpense() {
  const { user } = useUserStore()
  const { mutateAsync: createItem } = useCreateItem()
  const { data: categories, isLoading: isLoadingCategories } =
    useGetCategories()

  const createItemForm = useForm<CreateItemFormData>({
    resolver: zodResolver(createItemSchema),
    defaultValues: {
      name: '',
      description: '',
      categoryId: '',
      price: 0,
    },
  })

  async function handleCreateItem({
    name,
    description,
    categoryId,
    price,
  }: CreateItemFormData) {
    await createItem({
      name,
      description,
      categoryId,
      userId: user?.id ?? '',
      price,
    })

    createItemForm.reset()
  }

  return (
    <Form {...createItemForm}>
      <form
        className="flex flex-col gap-4"
        onSubmit={createItemForm.handleSubmit(handleCreateItem)}
      >
        <FormField
          control={createItemForm.control}
          name="name"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Nome do item</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Digite o nome do item..." />
                </FormControl>
                <FormMessage />
              </FormItem>
            )
          }}
        />

        <FormField
          control={createItemForm.control}
          name="description"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Descrição</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Digite a descrição do item..."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )
          }}
        />

        <FormField
          control={createItemForm.control}
          name="categoryId"
          render={({ field }) => {
            return (
              <Select onValueChange={field.onChange} {...field}>
                <FormLabel>Categoria</FormLabel>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={'Selecione a categoria'} />
                </SelectTrigger>
                <SelectContent>
                  {isLoadingCategories ? (
                    <div className='flex flex-col gap-2'>
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  ) : (
                    categories?.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
                <FormMessage />
              </Select>
            )
          }}
        />

        <FormField
          control={createItemForm.control}
          name="price"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Preço</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="remove-number-arrows"
                    placeholder="Digite o preço do item..."
                    type="number"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )
          }}
        />

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit">Criar item</Button>
        </DialogFooter>
      </form>
    </Form>
  )
}
