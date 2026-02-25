import { useCallback, useEffect, useRef, useState } from "react"
import "./index.scss"

type PhotoViewerProps = {
  src: string
  alt?: string
  onClose: () => void
}

type Point = { x: number; y: number }

const getDistance = (p1: Point, p2: Point) =>
  Math.hypot(p2.x - p1.x, p2.y - p1.y)

const getMidpoint = (p1: Point, p2: Point): Point => ({
  x: (p1.x + p2.x) / 2,
  y: (p1.y + p2.y) / 2,
})

const MIN_SCALE = 1
const MAX_SCALE = 4

export const PhotoViewer = ({ src, alt, onClose }: PhotoViewerProps) => {
  const [scale, setScale] = useState(1)
  const [translate, setTranslate] = useState<Point>({ x: 0, y: 0 })

  const scaleRef = useRef(1)
  const translateRef = useRef<Point>({ x: 0, y: 0 })

  const pinchStartDistance = useRef(0)
  const pinchStartScale = useRef(1)
  const pinchStartMid = useRef<Point>({ x: 0, y: 0 })
  const pinchStartTranslate = useRef<Point>({ x: 0, y: 0 })

  const panStart = useRef<Point>({ x: 0, y: 0 })
  const panStartTranslate = useRef<Point>({ x: 0, y: 0 })
  const isPanning = useRef(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)

  const updateTransform = useCallback((newScale: number, newTranslate: Point) => {
    scaleRef.current = newScale
    translateRef.current = newTranslate
    setScale(newScale)
    setTranslate(newTranslate)
  }, [])

  const clampTranslate = useCallback(
    (tx: number, ty: number, s: number): Point => {
      if (s <= 1) return { x: 0, y: 0 }
      const container = containerRef.current
      const img = imgRef.current
      if (!container || !img) return { x: tx, y: ty }

      const containerRect = container.getBoundingClientRect()
      const imgWidth = img.naturalWidth
      const imgHeight = img.naturalHeight

      // Calculate displayed image size (object-fit: contain)
      const containerW = containerRect.width
      const containerH = containerRect.height
      const imgRatio = imgWidth / imgHeight
      const containerRatio = containerW / containerH

      let displayW: number, displayH: number
      if (imgRatio > containerRatio) {
        displayW = containerW
        displayH = containerW / imgRatio
      } else {
        displayH = containerH
        displayW = containerH * imgRatio
      }

      const maxTx = Math.max(0, (displayW * s - containerW) / 2)
      const maxTy = Math.max(0, (displayH * s - containerH) / 2)

      return {
        x: Math.max(-maxTx, Math.min(maxTx, tx)),
        y: Math.max(-maxTy, Math.min(maxTy, ty)),
      }
    },
    [],
  )

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      isPanning.current = false
      const p1 = { x: e.touches[0].clientX, y: e.touches[0].clientY }
      const p2 = { x: e.touches[1].clientX, y: e.touches[1].clientY }
      pinchStartDistance.current = getDistance(p1, p2)
      pinchStartScale.current = scaleRef.current
      pinchStartMid.current = getMidpoint(p1, p2)
      pinchStartTranslate.current = { ...translateRef.current }
    } else if (e.touches.length === 1) {
      isPanning.current = true
      panStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
      panStartTranslate.current = { ...translateRef.current }
    }
  }, [])

  const onTouchMove = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault()
      if (e.touches.length === 2) {
        const p1 = { x: e.touches[0].clientX, y: e.touches[0].clientY }
        const p2 = { x: e.touches[1].clientX, y: e.touches[1].clientY }
        const dist = getDistance(p1, p2)
        const newScale = Math.min(
          MAX_SCALE,
          Math.max(MIN_SCALE, pinchStartScale.current * (dist / pinchStartDistance.current)),
        )

        const mid = getMidpoint(p1, p2)
        const dx = mid.x - pinchStartMid.current.x
        const dy = mid.y - pinchStartMid.current.y

        const newTranslate = clampTranslate(
          pinchStartTranslate.current.x + dx,
          pinchStartTranslate.current.y + dy,
          newScale,
        )
        updateTransform(newScale, newTranslate)
      } else if (e.touches.length === 1 && isPanning.current && scaleRef.current > 1) {
        const dx = e.touches[0].clientX - panStart.current.x
        const dy = e.touches[0].clientY - panStart.current.y
        const newTranslate = clampTranslate(
          panStartTranslate.current.x + dx,
          panStartTranslate.current.y + dy,
          scaleRef.current,
        )
        updateTransform(scaleRef.current, newTranslate)
      }
    },
    [clampTranslate, updateTransform],
  )

  const onTouchEnd = useCallback(() => {
    isPanning.current = false
    if (scaleRef.current <= 1) {
      updateTransform(1, { x: 0, y: 0 })
    }
  }, [updateTransform])

  // Double-tap to zoom in/out
  const lastTap = useRef(0)
  const onTap = useCallback(
    (e: React.TouchEvent) => {
      const now = Date.now()
      if (now - lastTap.current < 300) {
        e.preventDefault()
        if (scaleRef.current > 1) {
          updateTransform(1, { x: 0, y: 0 })
        } else {
          const touch = e.changedTouches[0]
          const container = containerRef.current
          if (container) {
            const rect = container.getBoundingClientRect()
            const cx = rect.width / 2
            const cy = rect.height / 2
            const tx = cx - touch.clientX + rect.left
            const ty = cy - touch.clientY + rect.top
            const newScale = 2.5
            const clamped = clampTranslate(tx, ty, newScale)
            updateTransform(newScale, clamped)
          }
        }
      }
      lastTap.current = now
    },
    [clampTranslate, updateTransform],
  )

  // Prevent background scroll
  useEffect(() => {
    document.body.classList.add("modal-open")
    return () => {
      document.body.classList.remove("modal-open")
    }
  }, [])

  return (
    <div className="photo-viewer-overlay" onClick={onClose}>
      <button className="photo-viewer-close" onClick={onClose} />
      <div
        className="photo-viewer-container"
        ref={containerRef}
        onClick={(e) => e.stopPropagation()}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onTouchCancel={onTouchEnd}
      >
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          draggable={false}
          className="photo-viewer-image"
          style={{
            transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`,
          }}
          onTouchEnd={onTap}
        />
      </div>
    </div>
  )
}
