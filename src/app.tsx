import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { InitialPage, LoginPage } from './pages'

const queryClient = new QueryClient()

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<InitialPage />} index />
          <Route element={<LoginPage />} path="/login" />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
