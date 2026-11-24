import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

// Cada área vira um chunk separado: a página de artigos não baixa o
// three.js/gsap do portfólio, e o editor (/admin) só existe em `npm run dev`.
const path = window.location.pathname

let Root
if (path.startsWith('/artigos')) {
  Root = lazy(() => import('./articles/ArticlesApp.jsx'))
} else if (import.meta.env.DEV && path.startsWith('/admin')) {
  Root = lazy(() => import('./admin/AdminApp.jsx'))
} else {
  Root = lazy(() => import('./App.jsx'))
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Suspense fallback={null}>
      <Root />
    </Suspense>
  </StrictMode>,
)
