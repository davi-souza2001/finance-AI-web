import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Dialog,
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
import { Skeleton } from '@/components/ui/skeleton'
import { useCreateItem } from '@/http/use-create-item'
import { useGenerateItem } from '@/http/use-generate-item'
import { useGetCategories } from '@/http/use-get-categories'
import { useUserStore } from '@/store/useUserStore'

const JSON_START_REGEX = /^```json\s*/
const CODE_START_REGEX = /^```\s*/
const CODE_END_REGEX = /\s*```$/

const createItemSchema = z.object({
  name: z.string().min(3, { message: 'Inclua no mínimo 3 caracteres' }),
  description: z.string(),
  categoryId: z.string().min(1, { message: 'Selecione uma categoria' }),
  price: z.coerce.number().min(1, { message: 'Inclua um valor' }),
  image: z.string().optional(),
})

type CreateItemFormData = z.infer<typeof createItemSchema>

type GeneratedItemResponse = {
  category: string
  value: string
}

export function FormExpense() {
  const { user } = useUserStore()
  const { mutateAsync: createItem } = useCreateItem()
  const { data: categories, isLoading: isLoadingCategories } =
    useGetCategories()
  const { mutateAsync: generateItem } = useGenerateItem()
  const [isGeneratingImage, setIsGeneratingImage] = useState(false)
  const [isGeneratedItemDialogOpen, setIsGeneratedItemDialogOpen] =
    useState(false)
  const [generatedItems, setGeneratedItems] = useState<GeneratedItemResponse[]>(
    []
  )
  const [isSendingGeneratedItems, setIsSendingGeneratedItems] = useState(false)
  const [apiResponse, setApiResponse] = useState<string>('')

  const createItemForm = useForm<CreateItemFormData>({
    resolver: zodResolver(createItemSchema),
    defaultValues: {
      name: '',
      description: '',
      categoryId: '',
      price: 0,
      image: '',
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

  const generateItemFactory = (item: string) => {
    try {
      let cleanItem = item.trim()

      if (cleanItem.startsWith('```json')) {
        cleanItem = cleanItem.replace(JSON_START_REGEX, '')
      }
      if (cleanItem.startsWith('```')) {
        cleanItem = cleanItem.replace(CODE_START_REGEX, '')
      }
      if (cleanItem.endsWith('```')) {
        cleanItem = cleanItem.replace(CODE_END_REGEX, '')
      }

      const parsedItem = JSON.parse(cleanItem)

      const itemsToProcess = Array.isArray(parsedItem)
        ? parsedItem
        : [parsedItem]

      const validJsonItems = itemsToProcess.filter(
        (itemValid) => itemValid.category && itemValid.value
      )

      if (validJsonItems.length > 0) {
        setGeneratedItems(validJsonItems)
        setIsGeneratedItemDialogOpen(true)
        setApiResponse('')
      } else {
        setApiResponse(item)
        setGeneratedItems([])
      }
    } catch {
      setApiResponse(item)
      setGeneratedItems([])
    }
  }

  const sendoItemsGenerated = () => {
    if (generatedItems.length > 0) {
      setIsSendingGeneratedItems(true)
      Promise.all(
        generatedItems.map(async (item) => {
          const category = categories?.find(
            (cat) => cat.name === item.category
          )

          await createItem({
            name: item?.category,
            description: item?.category,
            categoryId: category?.id ?? '',
            userId: user?.id ?? '',
            price: Number(item?.value.replace(/[^\d,]/g, '').replace(',', '.')),
          })
        })
      )
        .then(() => {
          setGeneratedItems([])
          setIsGeneratedItemDialogOpen(false)
        })
        .finally(() => {
          setIsSendingGeneratedItems(false)
        })
    }
  }

  const formatCategory = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1).toLowerCase()
  }

  const formatValue = (value: string) => {
    const numericValue = value.replace(/[^\d,]/g, '').replace(',', '.')
    const parsedValue = Number.parseFloat(numericValue)

    if (Number.isNaN(parsedValue)) {
      return value
    }

    return parsedValue.toFixed(2).replace('.', ',')
  }

  const calculateTotal = () => {
    return generatedItems.reduce((total, item) => {
      const numericValue = item.value.replace(/[^\d,]/g, '').replace(',', '.')
      const parsedValue = Number.parseFloat(numericValue)
      return total + (Number.isNaN(parsedValue) ? 0 : parsedValue)
    }, 0)
  }

  const handleImageChange = (file: File) => {
    const reader = new FileReader()

    reader.onload = () => {
      const dataUrl = reader.result as string
      const base64 = dataUrl.split(',')[1]

      generateItem({ image: base64 })
        .then((result) => {
          generateItemFactory(result?.itemId)
        })
        .catch(() => {
          setApiResponse('Erro ao processar imagem')
        })
        .finally(() => {
          setIsGeneratingImage(false)
        })
    }

    reader.readAsDataURL(file)
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
                      <div className="flex flex-col gap-2">
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
                          setIsGeneratingImage(true)
                          setApiResponse('')
                          const file = e.target.files?.[0]
                          if (file) {
                            handleImageChange(file)
                            return
                          }
                          setIsGeneratingImage(false)
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
              <p className="break-all text-sm">{apiResponse}</p>
            </div>
          )}

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Criar item</Button>
          </DialogFooter>
        </form>
      </Form>

      <Dialog
        onOpenChange={setIsGeneratedItemDialogOpen}
        open={isGeneratedItemDialogOpen}
      >
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
                    <tr className="border-t" key={item.category}>
                      <td className="px-4 py-3">
                        <span className="font-medium">
                          {formatCategory(item.category)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="font-bold">
                          R$ {formatValue(item.value)}
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
                        R$ {calculateTotal().toFixed(2).replace('.', ',')}
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
            <Button
              disabled={isSendingGeneratedItems}
              onClick={sendoItemsGenerated}
            >
              {isSendingGeneratedItems ? (
                <div className="mt-5 flex items-center justify-center">
                  <Loader2 className="animate-spin" />
                </div>
              ) : (
                'Usar Dados'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
