import { useRef, type MouseEvent } from 'react'
import { Link } from 'react-router-dom'
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'
import { ArrowRight, Bookmark, FolderOpen, StickyNote } from 'lucide-react'
import heroCharacter from '../assets/hero-spider-art.png'
import { getNoteCategories, type Note } from '../lib/notes'

interface HeroProps {
  notes: Note[]
}

export function Hero({ notes }: HeroProps) {
  const heroRef = useRef<HTMLElement>(null)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const pointerXSource = useMotionValue(0)
  const pointerYSource = useMotionValue(0)
  const pointerX = useSpring(pointerXSource, { stiffness: 55, damping: 22 })
  const pointerY = useSpring(pointerYSource, { stiffness: 55, damping: 22 })
  const spotlightXSource = useMotionValue(0)
  const spotlightYSource = useMotionValue(0)
  const spotlightOpacitySource = useMotionValue(0)
  const spotlightX = useSpring(spotlightXSource, { stiffness: 45, damping: 24 })
  const spotlightY = useSpring(spotlightYSource, { stiffness: 45, damping: 24 })
  const spotlightOpacity = useSpring(spotlightOpacitySource, { stiffness: 100, damping: 24 })
  const artX = useTransform(pointerX, (value) => value * 11)
  const artY = useTransform(pointerY, (value) => value * 8)
  const copyY = useTransform(scrollYProgress, [0, 1], [0, 42])
  const webY = useTransform(scrollYProgress, [0, 1], [0, -56])
  const characterY = useTransform(scrollYProgress, [0, 1], [0, -24])
  const statsY = useTransform(scrollYProgress, [0, 1], [0, -74])
  const stats = [
    { label: 'NOTES READY', value: notes.length, icon: StickyNote },
    { label: 'PINNED', value: notes.filter((note) => note.pinned).length, icon: Bookmark },
    { label: 'COLLECTIONS', value: getNoteCategories(notes).length, icon: FolderOpen },
  ]
  const handlePointerMove = (event: MouseEvent<HTMLElement>) => {
    if (reduceMotion) return
    const bounds = event.currentTarget.getBoundingClientRect()
    pointerXSource.set((event.clientX - bounds.left - bounds.width / 2) / (bounds.width / 2))
    pointerYSource.set((event.clientY - bounds.top - bounds.height / 2) / (bounds.height / 2))
    spotlightXSource.set(event.clientX - bounds.left)
    spotlightYSource.set(event.clientY - bounds.top)
    spotlightOpacitySource.set(1)
  }
  const resetPointer = () => {
    pointerXSource.set(0)
    pointerYSource.set(0)
    spotlightOpacitySource.set(0)
  }

  return (
    <section ref={heroRef} className="hero-section" onMouseMove={handlePointerMove} onMouseLeave={resetPointer}>
      {!reduceMotion && <motion.div className="hero-cursor-glow" style={{ left: spotlightX, top: spotlightY, opacity: spotlightOpacity }} aria-hidden="true" />}
      <div className="hero-content">
        <motion.div className="hero-copy" style={reduceMotion ? undefined : { y: copyY }}>
          <p className="hero-eyebrow"><span /> YOUR DAY, AT A GLANCE</p>
          <h1>A little web of <span>good things.</span></h1>
          <p className="hero-description">All the little things you need, ready when you are.</p>
          <Link className="comic-button hero-dashboard-button" to="/dashboard">
            <span>Open your dashboard</span><ArrowRight size={18} />
          </Link>
          <p className="hero-note-count">{notes.length} notes in your personal hub <span>✦</span></p>
        </motion.div>

        <motion.div className="hero-art" style={reduceMotion ? undefined : { x: artX, y: artY }} role="img" aria-label="Hero artwork floating over a decorative web with animated spiders">
          <motion.svg className="hero-art-web" viewBox="0 0 600 520" style={reduceMotion ? undefined : { y: webY }} aria-hidden="true">
            <circle cx="300" cy="260" r="220" />
            <circle cx="300" cy="260" r="160" />
            <circle cx="300" cy="260" r="100" />
            <path d="M300 40v440M80 260h440M145 105l310 310M455 105 145 415M220 53l160 414M507 180 93 340M380 53 220 467M507 340 93 180" />
          </motion.svg>
          <span className="hero-web-thread" aria-hidden="true" />
          <motion.div className="hero-character-parallax" style={reduceMotion ? undefined : { y: characterY }}>
            <img className="hero-character" src={heroCharacter} alt="" />
          </motion.div>
          <svg className="hero-spider hero-spider-small hero-spider-left" viewBox="0 0 180 180" aria-hidden="true">
            <g className="spider-legs"><path d="M75 77 51 60 32 64 18 51M69 88 43 84 25 96 10 92M70 101 45 110 35 128 20 132M79 111 62 133 64 151 52 163M105 77l24-17 19 4 14-13M111 88l26-4 18 12 15-4M110 101l25 9 10 18 15 4M101 111l17 22-2 18 12 12" /></g>
            <ellipse className="spider-abdomen" cx="90" cy="112" rx="22" ry="29" /><circle className="spider-head" cx="90" cy="72" r="19" />
          </svg>
          <svg className="hero-spider hero-spider-small hero-spider-right" viewBox="0 0 180 180" aria-hidden="true">
            <g className="spider-legs"><path d="M75 77 51 60 32 64 18 51M69 88 43 84 25 96 10 92M70 101 45 110 35 128 20 132M79 111 62 133 64 151 52 163M105 77l24-17 19 4 14-13M111 88l26-4 18 12 15-4M110 101l25 9 10 18 15 4M101 111l17 22-2 18 12 12" /></g>
            <ellipse className="spider-abdomen" cx="90" cy="112" rx="22" ry="29" /><circle className="spider-head" cx="90" cy="72" r="19" />
          </svg>
          <motion.div className="hero-art-stats" style={reduceMotion ? undefined : { y: statsY }}>
            {stats.map(({ label, value, icon: Icon }) => (
              <div className="hero-art-stat" key={label}>
                <Icon size={14} /><span>{label}</span><strong>{value}</strong>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
      <span className="hero-caption">A LITTLE WEB OF GOOD THINGS</span>
    </section>
  )
}
