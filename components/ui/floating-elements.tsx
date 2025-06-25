"use client"

import { motion } from "framer-motion"
import { Shield, Award, Users, Briefcase, Star, Zap } from "lucide-react"

const floatingElements = [
  { Icon: Shield, delay: 0, duration: 8 },
  { Icon: Award, delay: 1, duration: 10 },
  { Icon: Users, delay: 2, duration: 12 },
  { Icon: Briefcase, delay: 3, duration: 9 },
  { Icon: Star, delay: 4, duration: 11 },
  { Icon: Zap, delay: 5, duration: 7 },
]

export function FloatingElements() {
  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      {floatingElements.map(({ Icon, delay, duration }, index) => (
        <motion.div
          key={index}
          className="absolute opacity-10"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          animate={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            rotate: 360,
          }}
          transition={{
            duration,
            delay,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        >
          <Icon className="w-8 h-8 text-purple-400" />
        </motion.div>
      ))}
    </div>
  )
}
