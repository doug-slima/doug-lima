"use client"

import { useRef, useEffect, useCallback } from "react"

// ── Missing utilities (not in original source) ────────────────────────────────

function getLogoTransform(w: number, h: number, svgScale: number, svgW: number, svgH: number) {
  // Desktop (≥768px): scale by width  → shape fills full width, may overflow vertically
  // Mobile  (<768px): scale by height → shape fills full height, may overflow horizontally
  const base  = w >= 768 ? w / svgW : h / svgH
  const scale = base * svgScale
  return { scale, offsetX: (w - svgW * scale) / 2, offsetY: (h - svgH * scale) / 2 }
}

interface SVGPoint { x: number; y: number; edgeDist: number }

function fillSVGPath(pathStr: string, density: number, svgW: number, svgH: number): SVGPoint[] {
  const off = document.createElement("canvas")
  off.width = svgW; off.height = svgH
  const c2 = off.getContext("2d")!
  c2.fillStyle = "#fff"
  c2.fill(new Path2D(pathStr))
  const px = c2.getImageData(0, 0, svgW, svgH).data

  const isIn = (x: number, y: number) =>
    x >= 0 && x < svgW && y >= 0 && y < svgH && px[(y * svgW + x) * 4] > 128

  const dirs4: [number, number][] = [[1,0],[-1,0],[0,1],[0,-1]]
  const dirs8: [number, number][] = [[2,0],[-2,0],[0,2],[0,-2],[2,2],[-2,-2],[2,-2],[-2,2]]

  const edgeDist = (x: number, y: number): number => {
    for (const [dx, dy] of dirs4) if (!isIn(x + dx, y + dy)) return 1
    for (const [dx, dy] of dirs8) if (!isIn(x + dx, y + dy)) return 2
    return 6
  }

  const step = Math.max(1, Math.round(1 / density))
  const pts: SVGPoint[] = []
  for (let y = 0; y < svgH; y += step)
    for (let x = 0; x < svgW; x += step)
      if (isIn(x, y)) pts.push({ x, y, edgeDist: edgeDist(x, y) })
  return pts
}

// ── SVG Shape ─────────────────────────────────────────────────────────────────
const SVG_PATH = `M40.9092 1024H0V983.091H40.9092V1024Z M523.5 1024H433.5V983H523.5V1024Z M377.358 1024H286.358V983H377.358V1024Z M703.999 1024H663.09H581.273V983.091H663.089V983H703.998L703.999 1024Z M1031.27 1024H990.363V983.091H1031.27V1024Z M785.818 1023.91H744.909V983H785.818V1023.91Z M1154 1023.91H1072.18V983H1113.09L1113.09 942H1154V1023.91Z M1276.72 1023.91H1235.81V983H1276.72V1023.91Z M1358.54 1023.91H1317.63V983H1358.54V1023.91Z M1399.45 1023.91H1358.54V983H1399.45V1023.91Z M785.815 942H744.908L744.909 983H704V901.091H785.815V942Z M1235.82 982.909H1194.91V942H1235.82V982.909Z M1399.45 982.909H1358.54V942H1399.45V982.909Z M499.452 942H458.543V901.091H499.452V942Z M540.362 942H499.452V901.091H540.362V942Z M581.272 942H540.362V901.091H581.272V942Z M1113.09 942H1072.18V901.091H1113.09V942Z M1194.91 901H1195V941.909H1194.91V942H1154L1154 901L1154 860.091H1194.91V901Z M867.635 941.909H826.726V901H867.635V941.909Z M744.909 901H704V860.091H744.909V901Z M1072.18 901H1031.27L1031.27 860H1072.18L1072.18 901Z M1154 901H1113.09V860.091H1154L1154 901Z M294.184 778H376.18V819H458V860H376V819H294.18V778H253.274V737.091H294.184V778Z M621.999 860H539.999V819H621.999V860Z M703.999 860H663.09V819.091H703.999V860Z M990.362 860H949.453V819.091H990.362V860Z M1031.27 860H990.362V819.091H1031.27V860Z M1194.91 860H1154V819.091H1194.91V860Z M867.635 859.909H826.726V819H867.635V859.909Z M908.545 859.909H867.635V819H908.545V859.909Z M663.089 819H622.18V778.091H663.089V819Z M826.726 819H785.816V778.091H826.726V819Z M949.452 778H908.545V818.909H867.636V778H908.543V737.091H949.452V778Z M1399.45 818.909H1358.54V778H1399.45V818.909Z M663.089 696H622.229V778H581.229V696H622.18V655.091H663.089V696Z M785.815 778H744.906V737.091H785.815V778Z M990.362 778H949.452V737.091H990.362V778Z M253.273 738H171.273V697H253.273V738Z M826.726 737H785.816V696.091H826.726V737Z M867.636 737H826.726V696.091H867.636V737Z M908.546 737H867.636V696.091H908.546V737Z M990.362 737H949.453V696.091H990.362V737Z M1031.27 737H990.362V696.091H1031.27V737Z M785.818 654.909H785.815V655H785.818V695.909H785.815V696H704L703.999 655H744.906V614.091H744.909V614H785.818V654.909Z M1031.27 696H990.363V655.091H1031.27V696Z M1440.36 695.909H1399.45V655H1440.36V695.909Z M170.409 655H129.5V614.091H170.409V655Z M622.183 655H581.273V614.091H622.183V655Z M908.546 655H867.637V614.091H908.546V655Z M1399.45 654.909H1358.54V614H1399.45V654.909Z M744.909 614H704V573.091H744.909V614Z M949.455 573.091H990.362V614H949.453H908.543V573.091H908.546V573H949.455V573.091Z M40.9092 532H212.815V573H40.8154V533H0V492.091H40.9092V532Z M335.636 573H294.727V532.091H335.636V573Z M376.546 532.091H417.452V573H376.543V533H335.637V492.091H376.546V532.091Z M785.815 573H744.906V532.091H785.815V573Z M908.546 492L908.545 492.091L908.546 533H867.637V532.909L867.636 573H826.727H785.815V532.091H826.726V532H867.635V532.091L867.637 451.091H908.546V492Z M458.362 533H417.453V492.091H458.362V533Z M81.8154 492H0V451.091H81.8154V492Z M417.452 492H376.543V451.091H417.452V492Z M499.272 492H458.363V451.091H499.272V492Z M663.089 492H622.18V451.091H663.089V492Z M703.999 492H663.089V451.091H703.999V492Z M744.909 492H703.999V451.091H744.909V492Z M1113.09 492H1072.18V451.091H1113.09V492Z M1235.81 492H1194.9V451.091H1235.81V492Z M1276.72 492H1235.81V451.091H1276.72V492Z M1399.45 492H1358.54V451.091H1399.45V492Z M1031.27 491.909H990.362V451H1031.27V491.909Z M376.726 451H294.726V410H376.726V451Z M458.362 451H417.453V410.091H458.362V451Z M540.183 451H499.273V410.091H540.183V451Z M867.636 451H826.727V410.091H867.636V451Z M1235.81 451H1194.9V410.091H1235.81V451Z M1399.45 451H1358.54V410.091H1399.45V451Z M1440.36 451H1399.45V410.091H1440.36V451Z M81.8154 410H40.9062V369.091H81.8154V410Z M499.272 410H458.363V369.091H499.272V410Z M703.999 410H663.09V369.091H703.999V410Z M785.815 410H744.906V369.091H785.815V410Z M908.546 410H867.637V369.091H908.546V410Z M1154 410H1113.09V369.091H1154V410Z M1194.91 410H1154V369.091H1194.91V410Z M1113.09 369H1072.18V409.909H1031.27V369H1072.18V328.091H1113.09V369Z M204.546 369H163.637V328.091H204.546V369Z M417.452 369H376.543V328.091H417.452V369Z M458.362 369H417.452V328.091H458.362V369Z M990.362 369H949.453V328.091H990.362V369Z M163.636 328H122.727V287.091H163.636V328Z M245.452 328H204.543V287.091H245.452V328Z M335.636 328H294.727V287.091H335.636V328Z M376.546 328H335.636V287.091H376.546V328Z M785.815 328H744.906V287.091H785.815V328Z M867.636 328H826.727V287.091H867.636V328Z M949.452 328H908.543V287.091H949.452V328Z M1113.09 328H1072.18V287.091H1113.09V328Z M826.726 287H785.816V246.091H826.726V287Z M990.362 287H949.453V246.091H990.362V287Z M1072.18 287H1031.27V246.091H1072.18V287Z M1154 287H1113.09V246.091H1154V287Z M417.452 245.909H376.543V205H417.452V245.909Z M949.452 245.909H908.543V205H949.452V245.909Z M1113.09 245.909H1072.18V205H1113.09V245.909Z M1194.91 245.909H1154V205H1194.91V245.909Z M826.999 205H703.999V164H826.999V205Z M458.362 204.909H417.453V164H458.362V204.909Z M908.546 204.909H867.637V164H908.546V204.909Z M990.362 204.909H949.453V164H990.362V204.909Z M1154 204.909H1113.09V164H1154V204.909Z M540.183 163.909H499.273V123H540.183V163.909Z M949.452 163.909H908.543V123H949.452V163.909Z M1112.91 163.909H1072V123H1112.91V163.909Z M499.272 122.909H458.363V82H499.272V122.909Z M581.089 122.909H540.18V82H581.089V122.909Z M703.999 122.909H663.09V82H703.999V122.909Z M826.726 122.909H785.816V82H826.726V122.909Z M908.546 122.909H867.637V82H908.546V122.909Z M1031.27 122.909H990.363V82H1031.27V122.909Z M1072.18 122.909H1031.27V82H1072.18V122.909Z M581.089 41H540.183V81.9092H499.273V41H540.18V0.0908203H581.089V41Z M621.999 81.9092H581.09L581.089 41H621.999V81.9092Z M744.909 41H785.815V81.9092H744.906V41H704V0.0908203H744.909V41Z M40.9092 41H0V0.0908203H40.9092V41Z M662.909 41H621.999L622 0.0908203H662.909V41Z M867.815 41H785.815V0H867.815V41Z M1072.45 41H949.452V0H1072.45V41Z M1440.36 41H1399.45L1399.45 0.0908203H1440.36V41Z M1317.82 244.909H1399.82V285.909H1440V326.909H1399.64V285.909H1317.82V244.909H1276.91V204H1317.82V244.909Z M1276.91 204.909H1194.91V163.909H1276.91V204.909Z`
const SVG_WIDTH  = 1441
const SVG_HEIGHT = 1024

// ── Config ────────────────────────────────────────────────────────────────────
type AsciiConfig = Record<string, number>

export const DEFAULT_CONFIG: AsciiConfig = {
  cellSize:      16,
  speed:         0.55,
  waveFreq:      1.8,
  waveIntensity: 1.2,
  mouseRadius:   150,
  flickerRate:   5,
  noiseAmount:   0,
  scanlines:     0.46,
  charSet:       0, // 0 = minimal, 1 = code, 2 = blocks (stored as index)
}

const CHAR_RAMPS = {
  blocks:  " ░▒▓█",
  code:    " ._-~:;=!*#$@",
  minimal: " .-+X#",
}
type RampKey = keyof typeof CHAR_RAMPS

interface GridCell {
  col: number; row: number
  x: number;   y: number
  density: number; edgeFactor: number
  tornUntil: number
}

interface FlyingChar {
  x: number; y: number; vx: number; vy: number
  char: string; r: number; g: number; b: number
  life: number; maxLife: number; size: number
  rotation: number; rotSpeed: number
  mass: number; dragCoeff: number
  tumblePhase: number; tumbleFreq: number
  scaleY: number; flipSpeed: number
}

const MAX_FLYING = 80

export default function AsciiShader({
  config,
  svgScale = 1,
  theme = "dark",
  svgPath = SVG_PATH,
  svgWidth = SVG_WIDTH,
  svgHeight = SVG_HEIGHT,
  colorFn = () => "195,197,178",  // ~#C3C5B2 — slightly darker than #E8E9D9 for contrast
}: {
  config: AsciiConfig
  svgScale?: number
  theme?: "light" | "dark"
  svgPath?: string
  svgWidth?: number
  svgHeight?: number
  colorFn?: ((x: number, y: number, w: number, h: number) => string) | null
}) {
  const canvasRef    = useRef<HTMLCanvasElement>(null)
  const rafRef       = useRef<number>(0)
  const configRef    = useRef(config)
  const mouseRef     = useRef({ x: -9999, y: -9999 })
  const prevMouseRef = useRef({ x: -9999, y: -9999, time: 0 })
  const velRef       = useRef({ vx: 0, vy: 0, speed: 0 })
  const gridRef      = useRef<GridCell[]>([])
  const flyingRef    = useRef<FlyingChar[]>([])
  const lastFrameRef = useRef(0)
  const dimsRef      = useRef({ w: 0, h: 0 })
  const themeRef     = useRef(theme)
  const colorFnRef   = useRef(colorFn)
  const startTimeRef = useRef<number | null>(null)

  configRef.current  = config
  themeRef.current   = theme
  colorFnRef.current = colorFn

  const packKey = (col: number, row: number) => col * 100000 + row

  const init = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    startTimeRef.current = null

    const dpr = window.devicePixelRatio || 1
    const w   = window.innerWidth
    const h   = window.innerHeight
    canvas.width  = w * dpr
    canvas.height = h * dpr
    canvas.style.width  = `${w}px`
    canvas.style.height = `${h}px`
    dimsRef.current = { w, h }

    const points = fillSVGPath(svgPath, 1.2, svgWidth, svgHeight)
    const { scale, offsetX, offsetY } = getLogoTransform(w, h, svgScale, svgWidth, svgHeight)

    const charSize = configRef.current.cellSize
    const rowH     = charSize * 1.6
    const halfChar = charSize / 2

    const tempMap = new Map<number, { count: number; edgeSum: number }>()
    for (const p of points) {
      const tx  = p.x * scale + offsetX
      const ty  = p.y * scale + offsetY
      const col = Math.floor(tx / charSize)
      const row = Math.floor(ty / rowH)
      const key = packKey(col, row)
      const ex  = tempMap.get(key)
      ex ? (ex.count++, ex.edgeSum += p.edgeDist) : tempMap.set(key, { count: 1, edgeSum: p.edgeDist })
    }

    let maxDensity = 0
    for (const v of tempMap.values()) if (v.count > maxDensity) maxDensity = v.count

    let minCol = Infinity, maxCol = -Infinity, minRow = Infinity, maxRow = -Infinity
    const cells: GridCell[] = []
    const lookup = new Map<number, number>()
    for (const [key, v] of tempMap) {
      const row = key % 100000, col = (key - row) / 100000
      if (col < minCol) minCol = col; if (col > maxCol) maxCol = col
      if (row < minRow) minRow = row; if (row > maxRow) maxRow = row
      lookup.set(key, cells.length)
      cells.push({
        col, row,
        x: col * charSize + halfChar,
        y: row * rowH + charSize * 0.8,
        density:    v.count / maxDensity,
        edgeFactor: (v.edgeSum / v.count) / 10,
        tornUntil:  0,
      })
    }
    // store range on cells array for animate closure
    ;(cells as GridCell[] & { minCol: number; maxCol: number; minRow: number; maxRow: number }).minCol = minCol
    ;(cells as GridCell[] & { minCol: number; maxCol: number; minRow: number; maxRow: number }).maxCol = maxCol
    ;(cells as GridCell[] & { minCol: number; maxCol: number; minRow: number; maxRow: number }).minRow = minRow
    ;(cells as GridCell[] & { minCol: number; maxCol: number; minRow: number; maxRow: number }).maxRow = maxRow

    gridRef.current   = cells
    flyingRef.current = []
  }, [svgScale, svgPath, svgWidth, svgHeight])

  useEffect(() => {
    init()
    window.addEventListener("resize", init)
    return () => window.removeEventListener("resize", init)
  }, [init])

  useEffect(() => { init() }, [config.cellSize, init])

  useEffect(() => {
    const updatePointer = (x: number, y: number) => {
      const now  = performance.now()
      const prev = prevMouseRef.current
      const dt   = (now - prev.time) / 1000
      if (dt > 0.001 && dt < 0.15) {
        const rx = (x - prev.x) / dt, ry = (y - prev.y) / dt
        const v  = velRef.current
        v.vx = v.vx * 0.55 + rx * 0.45
        v.vy = v.vy * 0.55 + ry * 0.45
        v.speed = Math.sqrt(v.vx * v.vx + v.vy * v.vy)
      }
      prevMouseRef.current = { x, y, time: now }
      mouseRef.current     = { x, y }
    }
    const onMove  = (e: MouseEvent)  => updatePointer(e.clientX, e.clientY)
    const onTouch = (e: TouchEvent)  => { const t = e.touches[0]; if (t) updatePointer(t.clientX, t.clientY) }
    window.addEventListener("mousemove",  onMove)
    window.addEventListener("touchstart", onTouch, { passive: true })
    window.addEventListener("touchmove",  onTouch, { passive: true })
    return () => {
      window.removeEventListener("mousemove",  onMove)
      window.removeEventListener("touchstart", onTouch)
      window.removeEventListener("touchmove",  onTouch)
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d", { alpha: true })
    if (!ctx) return

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    const HACK_BOOT = "01{}[]<>/\\|!@#$%&*:;=+-_~"
    const RAMP_KEYS: RampKey[] = ["minimal", "code", "blocks"]

    const animate = (timestamp: number) => {
      if (startTimeRef.current === null) startTimeRef.current = timestamp
      const introDuration = 2.0
      const introElapsed  = reduceMotion ? introDuration : (timestamp - startTimeRef.current) * 0.001
      const dt = Math.min((timestamp - (lastFrameRef.current || timestamp)) / 1000, 0.05)
      lastFrameRef.current = timestamp

      const cfg        = configRef.current
      const dpr        = window.devicePixelRatio || 1
      const { w: width, h: height } = dimsRef.current
      const cells      = gridRef.current as GridCell[] & { minCol: number; maxCol: number; minRow: number; maxRow: number }
      const mouse      = reduceMotion ? { x: -9999, y: -9999 } : mouseRef.current
      const vel        = velRef.current
      const flying     = flyingRef.current
      const time       = reduceMotion ? 0 : timestamp * 0.001 * cfg.speed
      const charSize   = cfg.cellSize
      const rampKey    = RAMP_KEYS[Math.round(cfg.charSet) % 3] ?? "minimal"
      const ramp       = CHAR_RAMPS[rampKey]
      const rampLen    = ramp.length
      const mouseRad   = cfg.mouseRadius
      const mouseRadSq = mouseRad * mouseRad
      const isLight    = themeRef.current === "light"

      const colRange = Math.max(1, cells.maxCol - cells.minCol)
      const rowRange = Math.max(1, cells.maxRow - cells.minRow)

      ctx.save()
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, width, height)

      if (cells.length === 0) { ctx.restore(); rafRef.current = requestAnimationFrame(animate); return }

      // ── Spawn flying chars on fast swipe ────────────────────────────────────
      const speedThresh = 3200
      if (!reduceMotion && vel.speed > speedThresh && flying.length < MAX_FLYING) {
        const budget  = Math.min(Math.floor((vel.speed - speedThresh) / 800), 3, MAX_FLYING - flying.length)
        const dirX = vel.vx / vel.speed, dirY = vel.vy / vel.speed
        let spawned = 0
        const si = Math.floor(Math.random() * cells.length)
        for (let j = 0; j < cells.length && spawned < budget; j++) {
          const i = (si + j) % cells.length
          const c = cells[i]
          if (c.tornUntil > timestamp) continue
          const dx = c.x - mouse.x, dy = c.y - mouse.y, dSq = dx*dx + dy*dy
          if (dSq > mouseRadSq) continue
          if (Math.random() > (1 - Math.sqrt(dSq) / mouseRad) * 0.7) continue

          const wP = Math.sin((c.x/width)*cfg.waveFreq*6.28 + (c.y/height)*cfg.waveFreq*3.14 - time*2) * 0.5 + 0.5
          let br = Math.min(1, c.density*0.5 + c.edgeFactor*0.3 + wP*cfg.waveIntensity*0.3)
          const ch = ramp[Math.min((br*(rampLen-1))|0, rampLen-1)]
          if (ch === " ") continue

          const base = (120 + 135*br)|0
          let fr = (base*0.85 + 30*wP)|0, fg = (base*0.9 + 20*wP)|0, fb = base
          const cfnF = colorFnRef.current
          if (cfnF) {
            const t = cfnF(c.x, c.y, width, height).split(",").map(Number)
            const lum = (fr*0.299 + fg*0.587 + fb*0.114) / 255
            fr = Math.round(t[0]*lum); fg = Math.round(t[1]*lum); fb = Math.round(t[2]*lum)
          }

          const mass  = 0.5 + Math.random()*1.5
          const ba    = Math.atan2(dirY, dirX)
          const sa    = ba + (1.2/mass)*(Math.random()-0.5)
          const mag   = vel.speed * (0.06 + Math.random()*0.16) / Math.sqrt(mass)
          const pa    = ba + (Math.random()>0.5?1:-1)*1.5708
          const pm    = vel.speed * (0.01 + Math.random()*0.04) / mass
          const life  = 1.0 + Math.random()*1.2 + mass*0.3
          c.tornUntil = timestamp + life*1000
          flying.push({
            x: c.x, y: c.y,
            vx: Math.cos(sa)*mag + Math.cos(pa)*pm,
            vy: Math.sin(sa)*mag + Math.sin(pa)*pm - 30*(1/mass),
            char: ch, r: fr, g: fg, b: fb,
            life, maxLife: life, size: charSize,
            rotation: (Math.random()-0.5)*0.3,
            rotSpeed: (Math.random()-0.5)*(8/mass),
            mass, dragCoeff: 0.001 + Math.random()*0.002,
            tumblePhase: Math.random()*6.28, tumbleFreq: 2+Math.random()*4,
            scaleY: 1, flipSpeed: (Math.random()-0.5)*(6/mass),
          })
          spawned++
        }
      }

      // ── Physics + draw flying chars ──────────────────────────────────────────
      ctx.font = `${charSize}px monospace`
      ctx.textAlign = "center"; ctx.textBaseline = "middle"
      let wi = 0
      for (let i = 0; i < flying.length; i++) {
        const f = flying[i]
        const el = f.maxLife - f.life
        f.vy += 280 * f.mass * 0.7 * dt
        const sp = Math.sqrt(f.vx*f.vx + f.vy*f.vy)
        if (sp > 1) { const d = f.dragCoeff*sp*sp/f.mass; f.vx -= f.vx/sp*d*dt; f.vy -= f.vy/sp*d*dt }
        f.vx += Math.sin(el*f.tumbleFreq + f.tumblePhase)*15/f.mass*dt
        f.vy += Math.cos(el*f.tumbleFreq*0.7 + f.tumblePhase*1.3)*8/f.mass*dt
        f.x  += f.vx*dt; f.y += f.vy*dt
        f.rotation += f.rotSpeed*dt; f.rotSpeed *= (1 - 1.2*dt)
        f.scaleY = Math.cos(el*f.flipSpeed + f.tumblePhase)
        f.life -= dt
        if (f.life <= 0 || f.x < -200 || f.x > width+200 || f.y > height+200) continue
        const cr = Math.cos(f.rotation), sr = Math.sin(f.rotation), sy = f.scaleY
        ctx.setTransform(dpr*cr, dpr*sr*sy, -dpr*sr, dpr*cr*sy, dpr*f.x, dpr*f.y)
        const lr = f.life/f.maxLife
        const a  = lr < 0.35 ? (lr/0.35)*(lr/0.35) : 1
        ctx.fillStyle = `rgba(${f.r},${f.g},${f.b},${a})`
        ctx.fillText(f.char, 0, 0)
        if (wi !== i) flying[wi] = f; wi++
      }
      flying.length = wi

      // ── Static grid cells ────────────────────────────────────────────────────
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.font = `${charSize}px monospace`
      ctx.textAlign = "center"; ctx.textBaseline = "middle"

      for (let i = 0; i < cells.length; i++) {
        const c = cells[i]
        if (c.tornUntil > timestamp) continue

        const normCol  = (c.col - cells.minCol) / colRange
        const normRow  = (c.row - cells.minRow) / rowRange
        const cellDelay   = (normCol*0.5 + normRow*0.5) * 1.2
        const cellElapsed = Math.max(0, introElapsed - cellDelay)
        const cellProgress = introDuration > 0 ? Math.min(cellElapsed / (introDuration*0.5), 1) : 1
        if (cellProgress <= 0) continue
        const isSettled  = cellProgress >= 1
        const cyclePhase = isSettled ? -1 : Math.floor(cellElapsed*20 + c.col*7 + c.row*13)

        const dx = c.x - mouse.x, dy = c.y - mouse.y, dSq = dx*dx + dy*dy
        const mouseInf = dSq < mouseRadSq ? Math.max(0, 1 - Math.sqrt(dSq)/mouseRad) : 0

        const wP = Math.sin((c.x/width)*cfg.waveFreq*6.28 + (c.y/height)*cfg.waveFreq*3.14 - time*2) * 0.5 + 0.5
        let br = c.density*0.5 + c.edgeFactor*0.3 + wP*cfg.waveIntensity*0.3
        if (mouseInf > 0) br = Math.min(1, br + mouseInf*0.5)

        const fSeed = Math.sin(c.col*127.1 + c.row*311.7 + ((time*cfg.flickerRate)|0)*43.37)*43758.5453
        const flick = fSeed - Math.floor(fSeed)
        if (flick < cfg.noiseAmount*0.15) br = flick*2.5

        let char = ramp[Math.min((br*(rampLen-1))|0, rampLen-1)]
        if (char === " ") continue

        let r: number, g: number, b: number, alpha: number
        const cfn = colorFnRef.current

        if (isLight) {
          // Light theme: use colorFn colour directly with alpha mapped from brightness.
          // This avoids the luminance-multiplication path which gives wrong results on
          // light backgrounds (very dark edges, washed-out centres).
          const tint = (cfn ? cfn(c.x, c.y, width, height) : "232,233,217").split(",").map(Number)
          r = tint[0]; g = tint[1]; b = tint[2]
          const alphaDefault = 0.08 + br * 0.42   // soft — idle state
          const alphaActive  = 0.20 + br * 0.75   // strong — was the default before
          alpha = alphaDefault + (alphaActive - alphaDefault) * mouseInf
        } else {
          const base = (120 + 135*br)|0
          r = (base*0.85 + 30*wP)|0; g = (base*0.9 + 20*wP)|0; b = base
          alpha = 0.3 + br*0.7
          if (mouseInf > 0.1) { r = (r+(255-r)*mouseInf)|0; g = (g+(255-g)*mouseInf)|0; b = (b+(255-b)*mouseInf*0.8)|0 }
          if (cfn) {
            const t   = cfn(c.x, c.y, width, height).split(",").map(Number)
            const lum = (r*0.299 + g*0.587 + b*0.114) / 255
            r = Math.round(t[0]*lum); g = Math.round(t[1]*lum); b = Math.round(t[2]*lum)
          }
        }

        if (!isSettled && cyclePhase >= 0) {
          char  = HACK_BOOT[Math.abs(cyclePhase) % HACK_BOOT.length]
          alpha *= cellProgress
        } else if (mouseInf > 0.3 && flick < 0.3) {
          char = HACK_BOOT[(c.col*7 + c.row*13 + ((time*12)|0)) % HACK_BOOT.length]
        }

        ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`
        ctx.fillText(char, c.x, c.y)
      }

      // ── Scanlines ────────────────────────────────────────────────────────────
      if (cfg.scanlines > 0) {
        ctx.fillStyle = isLight ? `rgba(255,255,255,${cfg.scanlines*0.5})` : `rgba(0,0,0,${cfg.scanlines*0.5})`
        for (let sy = 0; sy < height; sy += 3) ctx.fillRect(0, sy, width, 1)
      }

      ctx.restore()
      if (!reduceMotion) rafRef.current = requestAnimationFrame(animate)
    }

    rafRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ background: "transparent", touchAction: "none" }}
    />
  )
}
