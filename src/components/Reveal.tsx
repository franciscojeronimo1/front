import { motion, useReducedMotion, type HTMLMotionProps } from 'motion/react'
import type { ReactNode } from 'react'

type RevealProps = {
  children: ReactNode
  className?: string
  /** Atraso em ms pra escalonar listas. */
  delay?: number
  as?: 'div' | 'li' | 'article' | 'section'
}

const ease = [0.22, 1, 0.36, 1] as const

export function Reveal({
  children,
  className = '',
  delay = 0,
  as = 'div',
}: RevealProps) {
  const reduceMotion = useReducedMotion()
  const MotionTag = motion[as] as typeof motion.div

  const motionProps: HTMLMotionProps<'div'> = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 22 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: '0px 0px -8% 0px', amount: 0.12 },
        transition: { duration: 0.65, delay: delay / 1000, ease },
      }

  return (
    <MotionTag className={className} {...motionProps}>
      {children}
    </MotionTag>
  )
}
