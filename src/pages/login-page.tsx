import { zodResolver } from '@hookform/resolvers/zod'
import Cookies from 'js-cookie'
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useLogin } from '@/http/user-login'

const loginSchema = z.object({
  email: z.string().email({ message: 'Email inválido' }).min(1, {
    message: 'Email é obrigatório',
  }),
  password: z
    .string()
    .min(8, { message: 'Senha deve ter no mínimo 8 caracteres' }),
})

type LoginFormData = z.infer<typeof loginSchema>

export function LoginPage() {
  const { mutateAsync: login } = useLogin()
  const navigate = useNavigate()

  const createLoginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function handleLoginItem({ email, password }: LoginFormData) {
    const { token } = await login({
      email,
      password,
    })

    if (token) {
      console.log('token :>> ', token);
      Cookies.set('auth-finance-ai-web', token, {
        expires: 7, // 7 days
        path: '/',
      })
      createLoginForm.reset()
      navigate('/')
    }
  }

  return (
    <div className="min-h-screen px-4">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center gap-4">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Login to your account</CardTitle>
            <CardDescription>
              Enter your email below to login to your account
            </CardDescription>
          </CardHeader>
          <Form {...createLoginForm}>
            <form className='flex flex-col gap-6' onSubmit={createLoginForm.handleSubmit(handleLoginItem)}>
              <CardContent>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <FormField
                      control={createLoginForm.control}
                      name="email"
                      render={({ field }) => {
                        return (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Digite o email..."
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )
                      }}
                    />
                  </div>
                  <div className="grid gap-2">
                    <FormField
                      control={createLoginForm.control}
                      name="password"
                      render={({ field }) => {
                        return (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Digite a senha..."
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )
                      }}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex-col gap-2">
                <Button
                  className="w-full cursor-pointer"
                  disabled={createLoginForm.formState.isSubmitting}
                  type="submit"
                >
                  {createLoginForm.formState.isSubmitting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    'Login'
                  )}
                </Button>
                <Link className="w-full" to="/register">
                  <Button className="w-full cursor-pointer" variant="outline">
                    Create an account
                  </Button>
                </Link>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>
    </div>
  )
}
