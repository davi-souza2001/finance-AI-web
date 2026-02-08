import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
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
import { useCreateItem } from '@/http/use-create-item'
import { useGenerateItem } from '@/http/use-generate-item'
import { TransactionCategories, type ItemsPropsResponse } from '@/http/types/itemType'

const createItemSchema = z.object({
  title: z.string().min(3, { message: 'Inclua no mínimo 3 caracteres' }),
  description: z.string(),
  category: z.nativeEnum(TransactionCategories),
  value: z.coerce.number().min(1, { message: 'Inclua um valor' }),
  image: z.string().optional(),
})

type CreateItemFormData = z.infer<typeof createItemSchema>

export function FormExpense() {
  const { mutateAsync: createItem } = useCreateItem()
  const categories = Object.values(TransactionCategories)
  const { mutateAsync: generateItem } = useGenerateItem()
  const [isGeneratingImage, setIsGeneratingImage] = useState(false)
  const [generatedItems, setGeneratedItems] = useState<ItemsPropsResponse[]>(
    []
  )
  const [apiResponse, setApiResponse] = useState<string>('')
  const totalSpent = generatedItems?.reduce((acc, item) => acc + item.props.value, 0) ?? 0

  const createItemForm = useForm<CreateItemFormData>({
    resolver: zodResolver(createItemSchema),
    defaultValues: {
      title: '',
      description: '',
      category: TransactionCategories.OTHER,
      value: 0,
      image: '',
    },
  })

  async function handleCreateItem({
    title,
    description,
    category,
    value,
  }: CreateItemFormData) {
    await createItem({
      title,
      description,
      category,
      value,
    })

    createItemForm.reset()
  }

  const handleImageChange = async (file: File) => {
    setIsGeneratingImage(true)
    setApiResponse('')
    const formData = new FormData()
    formData.set('image', file, file.name)

    try {
      const result = await generateItem(formData)

      setGeneratedItems(result)
      setApiResponse('')
    } catch {
      setApiResponse('Erro ao processar imagem')
    } finally {
      setIsGeneratingImage(false)
    }
  }

  return (
    <>
      <Form {...createItemForm}>
        <form
          className="flex flex-col gap-4"
          onSubmit={createItemForm.handleSubmit(handleCreateItem)}
        >
          <FormField
            control={createItemForm.control}
            name="title"
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
            name="category"
            render={({ field }) => {
              return (
                <Select onValueChange={field.onChange} {...field}>
                  <FormLabel>Categoria</FormLabel>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={'Selecione a categoria'} />
                  </SelectTrigger>
                  <SelectContent>
                    {
                      categories?.map((category, key) => (
                        <SelectItem key={key} value={category}>
                          {category}
                        </SelectItem>
                      ))
                    }
                  </SelectContent>
                  <FormMessage />
                </Select>
              )
            }}
          />

          <FormField
            control={createItemForm.control}
            name="value"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Valor</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="remove-number-arrows"
                      placeholder="Digite o valor do item..."
                      type="number"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )
            }}
          />

          <div className="flex w-full items-center justify-between gap-2">
            <FormField
              control={createItemForm.control}
              name="image"
              render={() => {
                return (
                  <FormItem className="w-full">
                    <FormLabel>Imagem</FormLabel>
                    <FormControl>
                      <Input
                        accept="image/*"
                        id="image"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            handleImageChange(file)
                            return
                          }
                        }}
                        type="file"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )
              }}
            />
            {isGeneratingImage && (
              <div className="mt-5 flex items-center justify-center">
                <Loader2 className="animate-spin" />
              </div>
            )}
          </div>

          {apiResponse && generatedItems.length === 0 && (
            <div className="rounded-lg border bg-muted/50 p-4">
              <p className="break-all text-sm text-red-400">{apiResponse}</p>
            </div>
          )}

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Criar item</Button>
          </DialogFooter>
        </form>
        {generatedItems.length > 0 && (
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {generatedItems.length === 1 ? 'Item Gerado' : 'Itens Gerados'}
              </DialogTitle>
              <DialogDescription>
                Aqui estão os detalhes sobre{' '}
                {generatedItems.length === 1 ? 'seu item' : 'seus itens'}:
              </DialogDescription>
            </DialogHeader>

            <div className="py-4">
              <div className="rounded-lg border">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                        Categoria
                      </th>
                      <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                        Valor
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {generatedItems.map((item) => (
                      <tr className="border-t" key={item._id.value}>
                        <td className="px-4 py-3">
                          <span className="font-medium">
                            {item.props.title}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className="font-bold">
                            R$ {item.props.value}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  {generatedItems.length > 1 && (
                    <tfoot className="border-t-2 ">
                      <tr>
                        <td className="px-4 py-3 font-extrabold">Total</td>
                        <td className="px-4 py-3 text-right font-bold text-green-600">
                          R$ {totalSpent.toFixed(2)}
                        </td>
                      </tr>
                    </tfoot>
                  )}
                </table>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Fechar</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        )}
      </Form>
    </>
  )
}
