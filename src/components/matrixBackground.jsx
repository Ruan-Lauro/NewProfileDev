import { useEffect, useRef } from 'react'

const CHARS = '01アイウエオカキクケコサシスセソタチツテトナニヌネノ{}[]()<>/=+*&|!?;:._'

export default function MatrixBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    let animId
    let columns = []
    let dots = []

    const FONT_SIZE = 15
    const COL_GAP = 80        
    const TRAIL = 10
    const SPEED = 0.5
    const CHAR_ALPHA_HEAD = 0.18   
    const DOT_ALPHA = 0.1        
    const DOT_SPACING = 28       

    function buildDots() {
      dots = []
      for (let x = DOT_SPACING; x < canvas.width; x += DOT_SPACING) {
        for (let y = DOT_SPACING; y < canvas.height; y += DOT_SPACING) {
          dots.push({ x, y })
        }
      }
    }

    function buildColumns() {
      const count = Math.floor(canvas.width / COL_GAP)
      columns = Array.from({ length: count }, (_, i) => ({
        x: i * COL_GAP + COL_GAP / 2,
        y: -(Math.random() * canvas.height * 1.5),
        speed: SPEED + Math.random() * 0.35,
        chars: Array.from({ length: TRAIL }, () =>
          CHARS[Math.floor(Math.random() * CHARS.length)]
        ),
        mutateTimer: 0,
        alphaMod: 0.6 + Math.random() * 0.4,
      }))
    }

    function init() {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
      buildDots()
      buildColumns()
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      ctx.fillStyle = `rgba(0, 0, 0, ${DOT_ALPHA})`
      dots.forEach(({ x, y }) => {
        ctx.beginPath()
        ctx.arc(x, y, 1, 0, Math.PI * 2)
        ctx.fill()
      })

      ctx.font = `${FONT_SIZE}px "Courier New", monospace`
      ctx.textAlign = 'center'

      columns.forEach(col => {
        col.mutateTimer++
        if (col.mutateTimer % 18 === 0) {
          const idx = Math.floor(Math.random() * col.chars.length)
          col.chars[idx] = CHARS[Math.floor(Math.random() * CHARS.length)]
        }

        col.chars.forEach((ch, i) => {
          const t = i / (TRAIL - 1)
          const alpha = (1 - t) * CHAR_ALPHA_HEAD * col.alphaMod
          if (alpha < 0.005) return
          ctx.fillStyle = `rgba(30, 30, 30, ${alpha})`
          ctx.fillText(ch, col.x, col.y - i * FONT_SIZE)
        })

        col.y += col.speed

        if (col.y - TRAIL * FONT_SIZE > canvas.height) {
          col.y = -(Math.random() * canvas.height * 0.8)
          col.speed = SPEED + Math.random() * 0.35
          col.alphaMod = 0.6 + Math.random() * 0.4
        }
      })

      animId = requestAnimationFrame(draw)
    }

    init()
    draw()

    const onResize = () => { init() }
    window.addEventListener('resize', onResize)
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        pointerEvents: 'none',
      }}
    />
  )
}