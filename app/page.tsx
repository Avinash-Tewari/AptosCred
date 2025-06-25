"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Users, Briefcase, Award, ArrowRight, Sparkles, Zap, Globe } from "lucide-react"
import Link from "next/link"
import { AnimatedBackground } from "@/components/ui/animated-background"
import { FloatingElements } from "@/components/ui/floating-elements"
import { GradientOrb } from "@/components/ui/gradient-orb"
import { fadeInUp, staggerContainer, staggerItem, scaleIn } from "@/lib/animations"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
      {/* Animated Background */}
      <AnimatedBackground />
      <FloatingElements />

      {/* Gradient Orbs */}
      <GradientOrb size="xl" color="purple" className="top-0 left-0 -translate-x-1/2 -translate-y-1/2" />
      <GradientOrb size="lg" color="blue" className="top-1/3 right-0 translate-x-1/2" />
      <GradientOrb size="md" color="cyan" className="bottom-0 left-1/3 translate-y-1/2" />

      {/* Header */}
      <motion.header
        className="border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between relative z-10">
          <motion.div
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            >
              <Shield className="w-8 h-8 text-purple-400" />
            </motion.div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              AptosCred
            </span>
          </motion.div>

          <nav className="hidden md:flex items-center space-x-6">
            {["Features", "How it Works", "Dashboard"].map((item, index) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.3 }}
              >
                <Link
                  href={item === "Dashboard" ? "/dashboard" : `#${item.toLowerCase().replace(" ", "-")}`}
                  className="text-gray-300 hover:text-purple-400 transition-colors duration-300"
                >
                  {item}
                </Link>
              </motion.div>
            ))}
          </nav>

          <motion.div
            className="flex items-center space-x-4"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Button
              variant="outline"
              className="border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white"
              asChild
            >
              <Link href="/dashboard">Connect Wallet</Link>
            </Button>
            <Button
              className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
              asChild
            >
              <Link href="/dashboard">Get Started</Link>
            </Button>
          </motion.div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="py-20 px-4 relative z-10">
        <div className="container mx-auto text-center">
          <motion.div {...fadeInUp}>
            <Badge className="mb-6 bg-purple-600/20 text-purple-300 border-purple-500/30 hover:bg-purple-600/30">
              <Sparkles className="w-4 h-4 mr-2" />
              Built on Aptos Blockchain
            </Badge>
          </motion.div>

          <motion.h1
            className="text-5xl md:text-7xl font-bold mb-6"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Decentralized Skill
            <motion.span
              className="block bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY }}
            >
              Verification
            </motion.span>
          </motion.h1>

          <motion.p
            className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed"
            {...fadeInUp}
            transition={{ delay: 0.4 }}
          >
            Build your professional reputation with verifiable skill credentials. Earn Soulbound NFTs, get peer
            endorsements, and find opportunities—all secured by blockchain technology.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <motion.div
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(147, 51, 234, 0.3)" }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg"
                asChild
              >
                <Link href="/dashboard">
                  Start Building Reputation
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="lg"
                variant="outline"
                className="border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-white"
                asChild
              >
                <Link href="/jobs">
                  <Globe className="w-4 h-4 mr-2" />
                  Browse Jobs
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 relative z-10">
        <div className="container mx-auto">
          <motion.div className="text-center mb-16" {...fadeInUp}>
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Why AptosCred?
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              The first decentralized platform that makes skill verification transparent, trustless, and truly owned by
              you.
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {[
              {
                icon: Shield,
                title: "Soulbound NFTs",
                description: "Non-transferable skill badges that prove your verified abilities",
                color: "from-purple-500 to-violet-500",
              },
              {
                icon: Users,
                title: "Peer Endorsements",
                description: "Get endorsed by other professionals with weighted reputation scores",
                color: "from-blue-500 to-cyan-500",
              },
              {
                icon: Briefcase,
                title: "Smart Escrow",
                description: "Secure job payments with blockchain-based escrow contracts",
                color: "from-green-500 to-emerald-500",
              },
              {
                icon: Award,
                title: "Reputation Score",
                description: "Dynamic scoring based on skills, endorsements, and job completion",
                color: "from-orange-500 to-red-500",
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                variants={staggerItem}
                whileHover={{
                  scale: 1.05,
                  rotateY: 5,
                  boxShadow: "0 25px 50px rgba(0, 0, 0, 0.3)",
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Card className="border-gray-700 bg-gray-800/50 backdrop-blur-sm hover:border-purple-500/50 transition-all duration-300 h-full">
                  <CardHeader>
                    <motion.div
                      className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} p-3 mb-4`}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <feature.icon className="w-6 h-6 text-white" />
                    </motion.div>
                    <CardTitle className="text-white">{feature.title}</CardTitle>
                    <CardDescription className="text-gray-400">{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-20 px-4 relative z-10">
        <div className="container mx-auto">
          <motion.div className="text-center mb-16" {...fadeInUp}>
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              How It Works
            </h2>
            <p className="text-xl text-gray-400">Simple steps to build your decentralized reputation</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Verify Skills",
                description: "Take tests, submit projects, or get peer verification for your skills",
                color: "from-purple-500 to-violet-500",
              },
              {
                step: "2",
                title: "Earn Badges",
                description: "Receive Soulbound NFT badges that prove your verified skills on-chain",
                color: "from-blue-500 to-cyan-500",
              },
              {
                step: "3",
                title: "Find Opportunities",
                description: "Use your reputation to find jobs and get endorsed by peers",
                color: "from-green-500 to-emerald-500",
              },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                className="text-center"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <motion.div
                  className={`w-16 h-16 rounded-full bg-gradient-to-r ${item.color} flex items-center justify-center mx-auto mb-4 shadow-lg`}
                  whileHover={{
                    scale: 1.1,
                    boxShadow: "0 20px 40px rgba(147, 51, 234, 0.4)",
                  }}
                  animate={{
                    boxShadow: [
                      "0 0 20px rgba(147, 51, 234, 0.3)",
                      "0 0 40px rgba(147, 51, 234, 0.6)",
                      "0 0 20px rgba(147, 51, 234, 0.3)",
                    ],
                  }}
                  transition={{
                    boxShadow: { duration: 2, repeat: Number.POSITIVE_INFINITY },
                    scale: { type: "spring", stiffness: 400, damping: 10 },
                  }}
                >
                  <span className="text-2xl font-bold text-white">{item.step}</span>
                </motion.div>
                <h3 className="text-xl font-semibold mb-2 text-white">{item.title}</h3>
                <p className="text-gray-400">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 relative z-10">
        <motion.div className="container mx-auto text-center" {...fadeInUp}>
          <div className="relative">
            <GradientOrb size="lg" color="purple" className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            <div className="relative z-10 bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-3xl p-12">
              <motion.h2
                className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent"
                {...scaleIn}
              >
                Ready to Build Your Reputation?
              </motion.h2>
              <motion.p
                className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto"
                {...fadeInUp}
                transition={{ delay: 0.2 }}
              >
                Join the future of professional verification. Own your skills, build trust, find opportunities.
              </motion.p>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={{ delay: 0.4 }}>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white shadow-xl"
                  asChild
                >
                  <Link href="/dashboard">
                    <Zap className="w-5 h-5 mr-2" />
                    Connect Your Wallet
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900/80 backdrop-blur-sm border-t border-gray-800 text-white py-12 px-4 relative z-10">
        <div className="container mx-auto">
          <motion.div
            className="grid md:grid-cols-4 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <motion.div variants={staggerItem}>
              <div className="flex items-center space-x-2 mb-4">
                <Shield className="w-6 h-6 text-purple-400" />
                <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  AptosCred
                </span>
              </div>
              <p className="text-gray-400">Decentralized skill verification and reputation platform built on Aptos.</p>
            </motion.div>

            {[
              {
                title: "Platform",
                links: ["Dashboard", "Verify Skills", "Job Board"],
              },
              {
                title: "Resources",
                links: ["Documentation", "API", "Smart Contracts"],
              },
              {
                title: "Community",
                links: ["Discord", "Twitter", "GitHub"],
              },
            ].map((section, index) => (
              <motion.div key={section.title} variants={staggerItem}>
                <h3 className="font-semibold mb-4 text-white">{section.title}</h3>
                <ul className="space-y-2 text-gray-400">
                  {section.links.map((link) => (
                    <li key={link}>
                      <Link href="#" className="hover:text-purple-400 transition-colors duration-300">
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            viewport={{ once: true }}
          >
            <p>&copy; 2024 AptosCred. Built on Aptos blockchain with ❤️</p>
          </motion.div>
        </div>
      </footer>
    </div>
  )
}
