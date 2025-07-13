import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { InitialPage } from './pages/initialPage'

const queryClient = new QueryClient()

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<InitialPage />} index />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
