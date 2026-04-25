import { useEffect, useState } from 'react'

export function ScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    function updateProgress() {
      const scrollTop = window.scrollY
      const height = document.documentElement.scrollHeight - window.innerHeight
      setProgress(height <= 0 ? 0 : scrollTop / height)
    }

    updateProgress()
    window.addEventListener('scroll', updateProgress, { passive: true })
    window.addEventListener('resize', updateProgress)
    return () => {
      window.removeEventListener('scroll', updateProgress)
      window.removeEventListener('resize', updateProgress)
    }
  }, [])

  return (
    <div className="fixed inset-x-0 top-0 z-[70] h-[2px] bg-transparent">
      <div
        className="h-full bg-[linear-gradient(90deg,var(--accent-cyan),var(--accent-green))] shadow-[0_0_18px_var(--accent-glow)] transition-[width] duration-200"
        style={{ width: `${progress * 100}%` }}
      />
    </div>
  )
}
