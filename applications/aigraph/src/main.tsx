import { createRoot } from 'react-dom/client'
import Preview from './Preview' // 修改为不带.tsx后缀
import './main.style.css'
createRoot(document.getElementById('root')!).render(
  <Preview />
)
