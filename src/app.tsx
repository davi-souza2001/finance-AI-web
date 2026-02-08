import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { PrivateRoute } from './components/private-route/private-route'
import { InitialPage, LoginPage } from './pages'
import { RegisterPage } from './pages/register-page'

const queryClient = new QueryClient()

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<LoginPage />} path="/login" />
          <Route element={<RegisterPage />} path="/register" />

          <Route element={<PrivateRoute />}>
            <Route element={<InitialPage />} index />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
