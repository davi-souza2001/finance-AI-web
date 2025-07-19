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
import { useCreateItem } from '@/http/use-create-item'

const createItemSchema = z.object({
  name: z.string().min(3, { message: 'Inclua no mínimo 3 caracteres' }),
  description: z.string(),
  categoryId: z.string().min(1, { message: 'Selecione uma categoria' }),
  price: z.coerce.number().min(1, { message: 'Inclua um valor' }),
})

type CreateItemFormData = z.infer<typeof createItemSchema>

export function FormExpense() {
  const { mutateAsync: createItem } = useCreateItem()

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
      categoryId: categoryId || '96d21a67-06a6-4df3-b237-3adf972b2bed',
      userId: 'a42dd495-cc6e-4b00-bbed-03a1a1d1fb54',
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
              <FormItem>
                <FormLabel>Categoria</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Digite a categoria do item..."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
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
          <DialogClose asChild>
            <Button type="submit">Criar item</Button>
          </DialogClose>
        </DialogFooter>
      </form>
    </Form>
  )
}
