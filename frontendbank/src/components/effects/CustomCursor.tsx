import { useEffect, useRef, useState } from 'react'
import { cx } from '@/utils/format'

type CursorMode = 'default' | 'interactive' | 'text'

const INTERACTIVE_SELECTOR =
  'a, button, [role="button"], summary, label[for], select, input, textarea'
const TEXT_SELECTOR = 'input:not([type="range"]), textarea, [contenteditable="true"]'

export function CustomCursor() {
  const [enabled, setEnabled] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(pointer: fine)').matches : false,
  )
  const [visible, setVisible] = useState(false)
  const [mode, setMode] = useState<CursorMode>('default')
  const [pressed, setPressed] = useState(false)
  const ringRef = useRef<HTMLDivElement | null>(null)
  const dotRef = useRef<HTMLDivElement | null>(null)
  const frameRef = useRef<number | null>(null)
  const targetRef = useRef({ x: 0, y: 0 })
  const ringPositionRef = useRef({ x: 0, y: 0 })
  const visibleRef = useRef(false)

  useEffect(() => {
    const media = window.matchMedia('(pointer: fine)')

    function handleChange(event: MediaQueryListEvent) {
      setEnabled(event.matches)
    }

    media.addEventListener('change', handleChange)
    return () => media.removeEventListener('change', handleChange)
  }, [])

  useEffect(() => {
    visibleRef.current = visible
  }, [visible])

  useEffect(() => {
    const root = document.documentElement

    if (!enabled) {
      delete root.dataset.customCursor
      return
    }

    root.dataset.customCursor = 'true'

    function resolveMode(target: EventTarget | null) {
      if (!(target instanceof Element)) {
        return 'default' as CursorMode
      }

      if (target.closest(TEXT_SELECTOR)) {
        return 'text' as CursorMode
      }

      if (target.closest(INTERACTIVE_SELECTOR)) {
        return 'interactive' as CursorMode
      }

      return 'default' as CursorMode
    }

    function syncCursor() {
      const ring = ringRef.current
      const dot = dotRef.current

      if (ring && dot) {
        ringPositionRef.current.x += (targetRef.current.x - ringPositionRef.current.x) * 0.28
        ringPositionRef.current.y += (targetRef.current.y - ringPositionRef.current.y) * 0.28

        ring.style.transform = `translate3d(${ringPositionRef.current.x}px, ${ringPositionRef.current.y}px, 0) translate(-50%, -50%)`
        dot.style.transform = `translate3d(${targetRef.current.x}px, ${targetRef.current.y}px, 0) translate(-50%, -50%)`
      }

      frameRef.current = window.requestAnimationFrame(syncCursor)
    }

    function handleMouseMove(event: MouseEvent) {
      targetRef.current = { x: event.clientX, y: event.clientY }

      if (!visibleRef.current) {
        ringPositionRef.current = { x: event.clientX, y: event.clientY }
        visibleRef.current = true
        setVisible(true)
      }

      setMode((current) => {
        const next = resolveMode(event.target)
        return current === next ? current : next
      })
    }

    function handleMouseOver(event: MouseEvent) {
      setMode((current) => {
        const next = resolveMode(event.target)
        return current === next ? current : next
      })
    }

    function handleWindowOut(event: MouseEvent) {
      if (event.relatedTarget === null) {
        visibleRef.current = false
        setVisible(false)
        setPressed(false)
      }
    }

    function handlePointerDown() {
      setPressed(true)
    }

    function handlePointerUp() {
      setPressed(false)
    }

    frameRef.current = window.requestAnimationFrame(syncCursor)
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    document.addEventListener('mouseover', handleMouseOver, true)
    window.addEventListener('mouseout', handleWindowOut)
    window.addEventListener('blur', handlePointerUp)
    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('mouseup', handlePointerUp)

    return () => {
      delete root.dataset.customCursor
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current)
      }
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseover', handleMouseOver, true)
      window.removeEventListener('mouseout', handleWindowOut)
      window.removeEventListener('blur', handlePointerUp)
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('mouseup', handlePointerUp)
    }
  }, [enabled])

  if (!enabled) {
    return null
  }

  return (
    <>
      <div
        ref={ringRef}
        aria-hidden="true"
        className={cx(
          'cursor-ring',
          visible && 'is-visible',
          mode === 'interactive' && 'is-interactive',
          mode === 'text' && 'is-text',
          pressed && 'is-pressed',
        )}
      />
      <div
        ref={dotRef}
        aria-hidden="true"
        className={cx(
          'cursor-dot',
          visible && 'is-visible',
          mode === 'interactive' && 'is-interactive',
          mode === 'text' && 'is-text',
          pressed && 'is-pressed',
        )}
      />
    </>
  )
}
