import { useMemo, useRef, type MouseEvent } from 'react'
import { Link } from 'react-router-dom'
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'
import { ArrowDown, ArrowRight } from 'lucide-react'

const buildings = [
  { x: 0, width: 110, height: 190 }, { x: 86, width: 130, height: 250 }, { x: 195, width: 92, height: 164 },
  { x: 264, width: 140, height: 218 }, { x: 386, width: 91, height: 288 }, { x: 464, width: 132, height: 202 },
  { x: 578, width: 105, height: 255 }, { x: 667, width: 152, height: 190 }, { x: 800, width: 110, height: 265 },
  { x: 894, width: 132, height: 219 }, { x: 1008, width: 96, height: 181 }, { x: 1090, width: 146, height: 242 },
]

const starPoints = Array.from({ length: 42 }, (_, index) => ({
  x: (index * 167 + 53) % 1200,
  y: (index * 67 + 29) % 390,
  r: index % 7 === 0 ? 2 : 1,
  opacity: .24 + ((index * 13) % 60) / 100,
}))

function CitySkyline() {
  const windows = useMemo(() => buildings.flatMap((building, buildingIndex) => {
    const cols = Math.max(2, Math.floor(building.width / 18))
    const rows = Math.max(3, Math.floor(building.height / 24))
    return Array.from({ length: cols * rows }, (_, index) => ({
      x: building.x + 8 + (index % cols) * 15,
      y: 680 - building.height + 14 + Math.floor(index / cols) * 19,
      lit: (index * 11 + buildingIndex * 3) % 5 !== 0,
    }))
  }), [])
  return (
    <svg className="city-svg" viewBox="0 0 1200 700" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      <g fill="currentColor">
        {buildings.map((building, index) => <path key={index} d={`M${building.x} 700V${680 - building.height}h${building.width}v${building.height}z`} />)}
        <path d="M0 680h1200v20H0z" />
      </g>
      <g className="city-windows">{windows.map((window, index) => window.lit && <rect key={index} x={window.x} y={window.y} width="4" height="7" rx="1" />)}</g>
    </svg>
  )
}

function HangingSpider() {
  return (
    <div className="hanging-spider" aria-hidden="true">
      <span className="spider-thread" />
      <svg viewBox="0 0 48 52">
        <path className="spider-leg" d="M20 24 11 19 6 22m22 2 9-5 5 3M19 30l-9 5-4-1m23-4 9 5 4-2M21 21l-5-7 2-4m9 11 5-7-2-4" />
        <ellipse cx="24" cy="29" rx="7" ry="9" />
        <circle cx="24" cy="17" r="5" />
        <circle className="spider-eye" cx="22" cy="16" r="1" /><circle className="spider-eye" cx="26" cy="16" r="1" />
      </svg>
    </div>
  )
}

export function Hero() {
  const heroRef = useRef<HTMLElement>(null)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const backY = useTransform(scrollYProgress, [0, 1], [0, 115])
  const midY = useTransform(scrollYProgress, [0, 1], [0, 64])
  const frontY = useTransform(scrollYProgress, [0, 1], [0, 24])
  const pointerXSource = useMotionValue(0)
  const pointerYSource = useMotionValue(0)
  const pointerX = useSpring(pointerXSource, { stiffness: 45, damping: 20 })
  const pointerY = useSpring(pointerYSource, { stiffness: 45, damping: 20 })
  const skyPointerX = useTransform(pointerX, (value) => value * .18)
  const cityPointerX = useTransform(pointerX, (value) => value * .34)
  const frontPointerX = useTransform(pointerX, (value) => value * .55)
  const frontRotate = useTransform(pointerY, [-10, 10], [-.2, .2])
  const skyBackgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '24%'])

  const handlePointer = (event: MouseEvent<HTMLElement>) => {
    if (reduceMotion) return
    const rect = event.currentTarget.getBoundingClientRect()
    pointerXSource.set((event.clientX - rect.left - rect.width / 2) / rect.width * 16)
    pointerYSource.set((event.clientY - rect.top - rect.height / 2) / rect.height * 13)
  }
  const resetPointer = () => { pointerXSource.set(0); pointerYSource.set(0) }

  return (
    <section ref={heroRef} className="hero-section" onMouseMove={handlePointer} onMouseLeave={resetPointer}>
      <motion.div className="hero-sky-layer" style={reduceMotion ? {} : { y: backY, x: skyPointerX, backgroundPositionY: skyBackgroundY }}>
        <div className="hero-moon" />
        <svg className="hero-stars" viewBox="0 0 1200 480" aria-hidden="true">{starPoints.map((star, index) => <circle key={index} cx={star.x} cy={star.y} r={star.r} opacity={star.opacity} />)}</svg>
      </motion.div>
      <motion.div className="hero-city-layer" style={reduceMotion ? {} : { y: midY, x: cityPointerX }}><CitySkyline /></motion.div>
      <motion.div className="hero-foreground-layer" style={reduceMotion ? {} : { y: frontY, x: frontPointerX, rotate: frontRotate }}>
        <svg className="corner-web web-left" viewBox="0 0 300 280" aria-hidden="true"><path d="M0 0h300M0 0v280M0 0l300 280M0 0l220 280M0 0l130 280M0 0l300 160M0 0l300 75M20 0c0 140 80 220 280 250M95 0c5 105 65 160 205 180M175 0c0 75 40 112 125 130" /></svg>
        <svg className="corner-web web-right" viewBox="0 0 300 280" aria-hidden="true"><path d="M300 0H0m300 0v280M300 0 0 280m300-280L80 280M300 0 170 280M300 0 0 160M300 0 0 75M280 0c0 140-80 220-280 250M205 0c-5 105-65 160-205 180M125 0c0 75-40 112-125 130" /></svg>
        <HangingSpider />
        <div className="hero-halftone" />
      </motion.div>
      {!reduceMotion && <div className="web-shoots" aria-hidden="true"><i /><i /><i /></div>}
      <div className="hero-copy">
        <span className="hero-eyebrow"><span /> JERA’S PERSONAL WEBLINE <span /></span>
        <h1>Hello,<br /><span>Jera!</span></h1>
        <p>Your notes, reminders and schedule,<br className="desktop-break" /> all in one web.</p>
        <Link className="comic-button" to="/dashboard"><span>Enter Dashboard</span><ArrowRight size={18} /></Link>
        <span className="hero-scroll-hint"><ArrowDown size={13} /> A little peek below</span>
      </div>
      <div className="hero-caption">YOUR FRIENDLY NEIGHBORHOOD MESSAGE HUB</div>
    </section>
  )
}
