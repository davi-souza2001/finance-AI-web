import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { InitialPage, LoginPage } from './pages'
import { RegisterPage } from './pages/register-page'

const queryClient = new QueryClient()

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<InitialPage />} index />
          <Route element={<LoginPage />} path="/login" />
          <Route element={<RegisterPage />} path="/register" />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
// Authorization: Bearer {{token}}
