import { AppRouter } from '@/app/AppRouter'
import { CustomCursor } from '@/components/effects/CustomCursor'
import { GrainOverlay } from '@/components/effects/GrainOverlay'
import { ScrollProgress } from '@/components/effects/ScrollProgress'

function App() {
  return (
    <>
      <ScrollProgress />
      <GrainOverlay />
      <CustomCursor />
      <AppRouter />
    </>
  )
}

export default App
