import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { LazyMotion, domAnimation } from 'framer-motion'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* LazyMotion with domAnimation: loads only the animation feature set,
        saves ~30 KB vs the full `motion` bundle. All components use `m.X`
        instead of `motion.X` and inherit features from this provider. */}
    <LazyMotion features={domAnimation} strict>
      <App />
    </LazyMotion>
  </StrictMode>,
)
