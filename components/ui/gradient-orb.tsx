"use client"

import { motion } from "framer-motion"

interface GradientOrbProps {
  size?: "sm" | "md" | "lg" | "xl"
  color?: "purple" | "blue" | "cyan" | "pink"
  className?: string
}

export function GradientOrb({ size = "md", color = "purple", className = "" }: GradientOrbProps) {
  const sizeClasses = {
    sm: "w-32 h-32",
    md: "w-64 h-64",
    lg: "w-96 h-96",
    xl: "w-[32rem] h-[32rem]",
  }

  const colorClasses = {
    purple: "bg-gradient-to-r from-purple-600/30 to-violet-600/30",
    blue: "bg-gradient-to-r from-blue-600/30 to-indigo-600/30",
    cyan: "bg-gradient-to-r from-cyan-600/30 to-teal-600/30",
    pink: "bg-gradient-to-r from-pink-600/30 to-rose-600/30",
  }

  return (
    <motion.div
      className={`
        ${sizeClasses[size]} 
        ${colorClasses[color]} 
        rounded-full blur-3xl absolute
        ${className}
      `}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.3, 0.6, 0.3],
        x: [0, 50, 0],
        y: [0, -30, 0],
      }}
      transition={{
        duration: 8,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      }}
    />
  )
}
