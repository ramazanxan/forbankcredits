import { useEffect, useRef } from 'react'
import styles from '@/components/effects/NeuralFieldCanvas.module.css'

interface NeuralFieldCanvasProps {
  magnetQuery?: string
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
}

export function NeuralFieldCanvas({ magnetQuery }: NeuralFieldCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) {
      return
    }

    const context = canvas.getContext('2d')
    if (!context) {
      return
    }

    let animationFrame = 0
    let width = 0
    let height = 0
    let mouse = { x: 0, y: 0 }
    const particles: Particle[] = Array.from({ length: 56 }, () => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.0014,
      vy: (Math.random() - 0.5) * 0.0014,
    }))

    const resize = () => {
      width = canvas.clientWidth
      height = canvas.clientHeight
      const ratio = window.devicePixelRatio || 1
      canvas.width = width * ratio
      canvas.height = height * ratio
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
    }

    const onMove = (event: MouseEvent) => {
      const bounds = canvas.getBoundingClientRect()
      mouse = {
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      }
    }

    const draw = () => {
      context.clearRect(0, 0, width, height)

      const attractor = magnetQuery
        ? document.querySelector<HTMLElement>(magnetQuery)
        : null
      const magnetBounds =
        attractor && attractor.matches(':hover') ? attractor.getBoundingClientRect() : null

      particles.forEach((particle) => {
        particle.x += particle.vx
        particle.y += particle.vy

        if (particle.x < 0 || particle.x > 1) {
          particle.vx *= -1
        }
        if (particle.y < 0 || particle.y > 1) {
          particle.vy *= -1
        }

        const px = particle.x * width
        const py = particle.y * height
        const dx = mouse.x - px
        const dy = mouse.y - py
        const distance = Math.hypot(dx, dy)

        if (distance < 180) {
          particle.vx += dx * 0.0000012
          particle.vy += dy * 0.0000012
        }

        if (magnetBounds) {
          const magnetX = magnetBounds.left + magnetBounds.width / 2 - canvas.getBoundingClientRect().left
          const magnetY = magnetBounds.top + magnetBounds.height / 2 - canvas.getBoundingClientRect().top
          particle.vx += (magnetX - px) * 0.0000008
          particle.vy += (magnetY - py) * 0.0000008
        }
      })

      for (let index = 0; index < particles.length; index += 1) {
        const source = particles[index]
        const sx = source.x * width
        const sy = source.y * height

        context.beginPath()
        context.fillStyle = 'rgba(0,229,195,0.8)'
        context.arc(sx, sy, 2.2, 0, Math.PI * 2)
        context.fill()

        for (let inner = index + 1; inner < particles.length; inner += 1) {
          const target = particles[inner]
          const tx = target.x * width
          const ty = target.y * height
          const distance = Math.hypot(sx - tx, sy - ty)

          if (distance < 140) {
            context.beginPath()
            context.strokeStyle = `rgba(0,229,195,${0.18 - distance / 780})`
            context.moveTo(sx, sy)
            context.lineTo(tx, ty)
            context.stroke()
          }
        }
      }

      animationFrame = window.requestAnimationFrame(draw)
    }

    resize()
    draw()
    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', onMove)

    return () => {
      window.cancelAnimationFrame(animationFrame)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
    }
  }, [magnetQuery])

  return <canvas ref={canvasRef} className={styles.canvas} />
}
