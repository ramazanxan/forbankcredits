import type { ButtonHTMLAttributes } from 'react'
import { useState } from 'react'
import { buttonClasses } from '@/components/common/buttonStyles'
import { useAppStore } from '@/store/appStore'
import { cx } from '@/utils/format'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  magnetic?: boolean
  fullWidth?: boolean
}

let audioContext: AudioContext | null = null

function playInteractionTone(enabled: boolean) {
  if (!enabled || typeof window === 'undefined') {
    return
  }

  const AudioCtx = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!AudioCtx) {
    return
  }

  audioContext ??= new AudioCtx()
  const oscillator = audioContext.createOscillator()
  const gain = audioContext.createGain()
  oscillator.type = 'triangle'
  oscillator.frequency.value = 540
  gain.gain.value = 0.03
  oscillator.connect(gain)
  gain.connect(audioContext.destination)
  oscillator.start()
  gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.08)
  oscillator.stop(audioContext.currentTime + 0.08)
}

export function Button({
  variant = 'primary',
  magnetic = false,
  fullWidth,
  className,
  disabled,
  onMouseMove,
  onMouseLeave,
  onClick,
  ...props
}: ButtonProps) {
  const soundEnabled = useAppStore((state) => state.soundEnabled)
  const [transform, setTransform] = useState('translate3d(0,0,0)')

  return (
    <button
      className={cx(buttonClasses(variant, fullWidth, disabled), className)}
      disabled={disabled}
      onMouseMove={(event) => {
        if (magnetic) {
          const bounds = event.currentTarget.getBoundingClientRect()
          const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 16
          const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 16
          setTransform(`translate3d(${x}px, ${y}px, 0)`)
        }
        onMouseMove?.(event)
      }}
      onMouseLeave={(event) => {
        setTransform('translate3d(0,0,0)')
        onMouseLeave?.(event)
      }}
      onClick={(event) => {
        playInteractionTone(soundEnabled)
        onClick?.(event)
      }}
      style={{ transform }}
      {...props}
    />
  )
}
