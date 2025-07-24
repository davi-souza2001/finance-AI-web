import Cookies from 'js-cookie'
import { ArrowDownIcon, LogOutIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Button } from '../ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'

export const Header = () => {
  const navigate = useNavigate()

   const logout = () => {
    Cookies.remove('auth-finance-ai-web')
    navigate('/login')
  }

  return (
    <div className="flex w-full items-center justify-between">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            className="flex cursor-pointer items-center gap-3"
            variant="ghost"
          >
            <Avatar>
              <AvatarImage alt="@shadcn" src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <p>Davi Souza</p>
            <ArrowDownIcon className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-32">
          <Button
            className="cursor-pointer hover:bg-destructive/50"
            onClick={logout}
            variant="destructive"
          >
            <LogOutIcon />
            Logout
          </Button>
        </PopoverContent>
      </Popover>
      <Button
        className="cursor-pointer text-zinc-500 hover:bg-zinc-100 hover:text-zinc-400"
        variant="ghost"
      >
        Help
      </Button>
    </div>
  )
}
