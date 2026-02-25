import { useCallback, useEffect, useRef, useState } from "react"
import "./index.scss"

type PhotoViewerProps = {
  images: string[]
  initialIndex: number
  onClose: () => void
  zoomEnabled?: boolean
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
const SWIPE_THRESHOLD = 50

export const PhotoViewer = ({
  images,
  initialIndex,
  onClose,
  zoomEnabled = false,
}: PhotoViewerProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [scale, setScale] = useState(1)
  const [translate, setTranslate] = useState<Point>({ x: 0, y: 0 })
  const [swipeOffset, setSwipeOffset] = useState(0)

  const scaleRef = useRef(1)
  const translateRef = useRef<Point>({ x: 0, y: 0 })

  const pinchStartDistance = useRef(0)
  const pinchStartScale = useRef(1)
  const pinchStartMid = useRef<Point>({ x: 0, y: 0 })
  const pinchStartTranslate = useRef<Point>({ x: 0, y: 0 })

  const panStart = useRef<Point>({ x: 0, y: 0 })
  const panStartTranslate = useRef<Point>({ x: 0, y: 0 })
  const isPanning = useRef(false)
  const swipeStartX = useRef(0)
  const isSwiping = useRef(false)
  const swipeOffsetRef = useRef(0)
  const currentIndexRef = useRef(initialIndex)

  const containerRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)

  const updateTransform = useCallback(
    (newScale: number, newTranslate: Point) => {
      scaleRef.current = newScale
      translateRef.current = newTranslate
      setScale(newScale)
      setTranslate(newTranslate)
    },
    [],
  )

  const resetZoom = useCallback(() => {
    scaleRef.current = 1
    translateRef.current = { x: 0, y: 0 }
    setScale(1)
    setTranslate({ x: 0, y: 0 })
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

  const onTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length === 2 && zoomEnabled) {
        isPanning.current = false
        isSwiping.current = false
        const p1 = { x: e.touches[0].clientX, y: e.touches[0].clientY }
        const p2 = { x: e.touches[1].clientX, y: e.touches[1].clientY }
        pinchStartDistance.current = getDistance(p1, p2)
        pinchStartScale.current = scaleRef.current
        pinchStartMid.current = getMidpoint(p1, p2)
        pinchStartTranslate.current = { ...translateRef.current }
      } else if (e.touches.length === 1) {
        if (scaleRef.current > 1 && zoomEnabled) {
          isPanning.current = true
          isSwiping.current = false
        } else {
          isPanning.current = false
          isSwiping.current = true
        }
        panStart.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        }
        panStartTranslate.current = { ...translateRef.current }
        swipeStartX.current = e.touches[0].clientX
      }
    },
    [zoomEnabled],
  )

  const onTouchMove = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault()
      if (e.touches.length === 2 && zoomEnabled) {
        const p1 = { x: e.touches[0].clientX, y: e.touches[0].clientY }
        const p2 = { x: e.touches[1].clientX, y: e.touches[1].clientY }
        const dist = getDistance(p1, p2)
        const newScale = Math.min(
          MAX_SCALE,
          Math.max(
            MIN_SCALE,
            pinchStartScale.current * (dist / pinchStartDistance.current),
          ),
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
      } else if (e.touches.length === 1) {
        if (isPanning.current && scaleRef.current > 1) {
          const dx = e.touches[0].clientX - panStart.current.x
          const dy = e.touches[0].clientY - panStart.current.y
          const newTranslate = clampTranslate(
            panStartTranslate.current.x + dx,
            panStartTranslate.current.y + dy,
            scaleRef.current,
          )
          updateTransform(scaleRef.current, newTranslate)
        } else if (isSwiping.current && scaleRef.current <= 1) {
          const dx = e.touches[0].clientX - swipeStartX.current
          swipeOffsetRef.current = dx
          setSwipeOffset(dx)
        }
      }
    },
    [clampTranslate, updateTransform, zoomEnabled],
  )

  const onTouchEnd = useCallback(() => {
    if (isSwiping.current && scaleRef.current <= 1) {
      isSwiping.current = false
      const offset = swipeOffsetRef.current
      const idx = currentIndexRef.current

      if (offset < -SWIPE_THRESHOLD && idx < images.length - 1) {
        // Swipe left -> next: just change index immediately
        const newIndex = idx + 1
        currentIndexRef.current = newIndex
        setCurrentIndex(newIndex)
        swipeOffsetRef.current = 0
        setSwipeOffset(0)
      } else if (offset > SWIPE_THRESHOLD && idx > 0) {
        // Swipe right -> prev: just change index immediately
        const newIndex = idx - 1
        currentIndexRef.current = newIndex
        setCurrentIndex(newIndex)
        swipeOffsetRef.current = 0
        setSwipeOffset(0)
      } else {
        // Snap back
        swipeOffsetRef.current = 0
        setSwipeOffset(0)
      }
    } else {
      isPanning.current = false
      if (scaleRef.current <= 1) {
        updateTransform(1, { x: 0, y: 0 })
      }
    }
  }, [images.length, updateTransform])

  // Double-tap to zoom in/out
  const lastTap = useRef(0)
  const onTap = useCallback(
    (e: React.TouchEvent) => {
      if (!zoomEnabled || isSwiping.current) return
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
    [clampTranslate, updateTransform, zoomEnabled],
  )

  // Reset zoom when navigating
  useEffect(() => {
    resetZoom()
  }, [currentIndex, resetZoom])

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
      <div className="photo-viewer-counter">
        {currentIndex + 1} / {images.length}
      </div>
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
          src={images[currentIndex]}
          alt={`${currentIndex}`}
          draggable={false}
          className="photo-viewer-image"
          style={{
            transform:
              scaleRef.current > 1
                ? `translate(${translate.x}px, ${translate.y}px) scale(${scale})`
                : `translateX(${swipeOffset}px)`,
          }}
          onTouchEnd={onTap}
        />
      </div>
    </div>
  )
}
