"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Shield,
  Award,
  Users,
  Briefcase,
  Plus,
  Star,
  TrendingUp,
  Wallet,
  ExternalLink,
  Sparkles,
  Zap,
} from "lucide-react"
import Link from "next/link"
import { ContractStatus } from "@/components/contract-status"
import { AnimatedBackground } from "@/components/ui/animated-background"
import { GradientOrb } from "@/components/ui/gradient-orb"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { fadeInUp, staggerContainer, staggerItem, pulseAnimation } from "@/lib/animations"

export default function Dashboard() {
  const [isWalletConnected, setIsWalletConnected] = useState(false)
  const [userAddress, setUserAddress] = useState("")
  const [isConnecting, setIsConnecting] = useState(false)

  const connectWallet = async () => {
    setIsConnecting(true)
    // Simulate wallet connection
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsWalletConnected(true)
    setUserAddress("0x1234...5678")
    setIsConnecting(false)
  }

  const mockSkillBadges = [
    {
      id: 1,
      skill: "React Development",
      level: "Expert",
      verified: true,
      endorsements: 12,
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: 2,
      skill: "Smart Contracts",
      level: "Advanced",
      verified: true,
      endorsements: 8,
      color: "from-purple-500 to-violet-500",
    },
    {
      id: 3,
      skill: "UI/UX Design",
      level: "Intermediate",
      verified: true,
      endorsements: 15,
      color: "from-pink-500 to-rose-500",
    },
    {
      id: 4,
      skill: "Python",
      level: "Expert",
      verified: false,
      endorsements: 0,
      color: "from-green-500 to-emerald-500",
    },
  ]

  const mockEndorsements = [
    { id: 1, from: "Alice Johnson", skill: "React Development", reputation: 850, date: "2024-01-15", avatar: "AJ" },
    { id: 2, from: "Bob Smith", skill: "Smart Contracts", reputation: 720, date: "2024-01-10", avatar: "BS" },
    { id: 3, from: "Carol Davis", skill: "UI/UX Design", reputation: 680, date: "2024-01-08", avatar: "CD" },
  ]

  if (!isWalletConnected) {
    return (
      <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
        <AnimatedBackground />
        <GradientOrb size="xl" color="purple" className="top-0 right-0 translate-x-1/2 -translate-y-1/2" />
        <GradientOrb size="lg" color="blue" className="bottom-0 left-0 -translate-x-1/2 translate-y-1/2" />

        <div className="flex items-center justify-center min-h-screen relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="w-full max-w-md bg-gray-800/50 backdrop-blur-sm border-gray-700">
              <CardHeader className="text-center">
                <motion.div
                  className="w-16 h-16 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4"
                  {...pulseAnimation}
                >
                  <Wallet className="w-8 h-8 text-white" />
                </motion.div>
                <CardTitle className="text-2xl text-white">Connect Your Wallet</CardTitle>
                <CardDescription className="text-gray-400">
                  Connect your Aptos wallet to access your AptosCred profile
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <AnimatePresence>
                  {isConnecting ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center justify-center py-4"
                    >
                      <LoadingSpinner />
                      <span className="ml-3 text-gray-300">Connecting...</span>
                    </motion.div>
                  ) : (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                      {["Petra Wallet", "Martian Wallet", "Pontem Wallet"].map((wallet, index) => (
                        <motion.div
                          key={wallet}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Button
                            onClick={connectWallet}
                            className={`w-full ${
                              index === 0
                                ? "bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
                                : "bg-gray-700 hover:bg-gray-600"
                            } text-white`}
                            disabled={isConnecting}
                          >
                            <Sparkles className="w-4 h-4 mr-2" />
                            Connect {wallet}
                          </Button>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
      <AnimatedBackground />
      <GradientOrb size="lg" color="purple" className="top-0 right-0 translate-x-1/2 -translate-y-1/2" />
      <GradientOrb size="md" color="cyan" className="bottom-1/3 left-0 -translate-x-1/2" />

      {/* Header */}
      <motion.header
        className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <motion.div className="flex items-center space-x-2" whileHover={{ scale: 1.05 }}>
            <Shield className="w-8 h-8 text-purple-400" />
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              AptosCred
            </span>
          </motion.div>
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="text-green-400 border-green-500/30 bg-green-500/10">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
              Connected: {userAddress}
            </Badge>
            <Button variant="outline" size="sm" className="font-bold bg-gradient-to-r from-purple-400 to-cyan-400  hover:bg-gray-700">
              Disconnect
            </Button>
          </div>
        </div>
      </motion.header>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Profile Overview */}
        <motion.div
          className="grid lg:grid-cols-4 gap-6 mb-8"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          <motion.div variants={staggerItem}>
            <Card className="lg:col-span-1 bg-gray-800/50 backdrop-blur-sm border-gray-700">
              <CardHeader className="text-center">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Avatar className="w-24 h-24 mx-auto mb-4 ring-4 ring-purple-500/30">
                    <AvatarImage src="/placeholder.svg?height=96&width=96" />
                    <AvatarFallback className="text-2xl bg-gradient-to-r from-purple-600 to-cyan-600 text-white">
                      JD
                    </AvatarFallback>
                  </Avatar>
                </motion.div>
                <CardTitle className="text-white">Snowfell</CardTitle>
                <CardDescription className="text-gray-400">Full Stack Developer</CardDescription>
                <motion.div className="flex items-center justify-center space-x-2 mt-2" whileHover={{ scale: 1.05 }}>
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="font-semibold text-white">4.8</span>
                  <span className="text-sm text-gray-400">(24 reviews)</span>
                </motion.div>
              </CardHeader>
            </Card>
          </motion.div>

          <motion.div variants={staggerItem} className="lg:col-span-3">
            <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <TrendingUp className="w-5 h-5 mr-2 text-green-400" />
                  Reputation Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-4">
                  {[
                    { value: "742", label: "Reputation Score", color: "text-purple-400", icon: Shield },
                    { value: "12", label: "Skill Badges", color: "text-blue-400", icon: Award },
                    { value: "35", label: "Endorsements", color: "text-green-400", icon: Users },
                    { value: "8", label: "Jobs Completed", color: "text-orange-400", icon: Briefcase },
                  ].map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      className="text-center"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 + 0.3 }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <motion.div
                        className={`text-3xl font-bold ${stat.color} mb-1`}
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: index * 0.5 }}
                      >
                        {stat.value}
                      </motion.div>
                      <div className="text-sm text-gray-400 flex items-center justify-center">
                        <stat.icon className="w-4 h-4 mr-1" />
                        {stat.label}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Contract Status */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <ContractStatus />
        </motion.div>

        {/* Main Content */}
        <Tabs defaultValue="skills" className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
            <TabsList className="grid w-full grid-cols-4 bg-gray-800/50 border border-gray-700">
              {["skills", "endorsements", "jobs", "verify"].map((tab, index) => (
                <TabsTrigger
                  key={tab}
                  value={tab}
                  className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-300"
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </TabsTrigger>
              ))}
            </TabsList>
          </motion.div>

          <TabsContent value="skills" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Your Skill Badges</h2>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
                  asChild
                >
                  <Link href="/verify">
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Skill
                  </Link>
                </Button>
              </motion.div>
            </div>

            <motion.div
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              {mockSkillBadges.map((badge, index) => (
                <motion.div
                  key={badge.id}
                  variants={staggerItem}
                  whileHover={{
                    scale: 1.05,
                    rotateY: 5,
                    boxShadow: "0 25px 50px rgba(0, 0, 0, 0.3)",
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Card
                    className={`${badge.verified ? "border-green-500/30 bg-green-500/5" : "border-gray-700"} bg-gray-800/50 backdrop-blur-sm`}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg text-white">{badge.skill}</CardTitle>
                        <motion.div
                          animate={
                            badge.verified
                              ? {
                                  boxShadow: [
                                    "0 0 20px rgba(34, 197, 94, 0.3)",
                                    "0 0 40px rgba(34, 197, 94, 0.6)",
                                    "0 0 20px rgba(34, 197, 94, 0.3)",
                                  ],
                                }
                              : {}
                          }
                          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                        >
                          <Shield className={`w-6 h-6 ${badge.verified ? "text-green-400" : "text-gray-500"}`} />
                        </motion.div>
                      </div>
                      <CardDescription className="text-gray-400">Level: {badge.level}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <Badge
                          variant={badge.verified ? "default" : "secondary"}
                          className={badge.verified ? "bg-green-600 text-white" : "bg-gray-600 text-gray-300"}
                        >
                          {badge.verified ? "Verified" : "Pending"}
                        </Badge>
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-400">{badge.endorsements}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </TabsContent>

          <TabsContent value="endorsements" className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Recent Endorsements</h2>

            <motion.div className="space-y-4" variants={staggerContainer} initial="initial" animate="animate">
              {mockEndorsements.map((endorsement, index) => (
                <motion.div
                  key={endorsement.id}
                  variants={staggerItem}
                  whileHover={{ scale: 1.02, x: 10 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <motion.div whileHover={{ scale: 1.1, rotate: 5 }}>
                            <Avatar className="ring-2 ring-purple-500/30">
                              <AvatarFallback className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white">
                                {endorsement.avatar}
                              </AvatarFallback>
                            </Avatar>
                          </motion.div>
                          <div>
                            <div className="font-semibold text-white">{endorsement.from}</div>
                            <div className="text-sm text-gray-400">endorsed your {endorsement.skill}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-purple-400">Rep: {endorsement.reputation}</div>
                          <div className="text-sm text-gray-400">{endorsement.date}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </TabsContent>

          <TabsContent value="jobs" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Job History</h2>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                  asChild
                >
                  <Link href="/jobs">
                    <Briefcase className="w-4 h-4 mr-2" />
                    Browse Jobs
                  </Link>
                </Button>
              </motion.div>
            </div>

            <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
              <CardContent className="pt-6">
                <motion.div className="text-center py-8" {...fadeInUp}>
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  >
                    <Briefcase className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                  </motion.div>
                  <h3 className="text-lg font-semibold text-gray-400 mb-2">No completed jobs yet</h3>
                  <p className="text-gray-500 mb-4">Start building your reputation by completing your first job</p>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
                      asChild
                    >
                      <Link href="/jobs">Find Your First Job</Link>
                    </Button>
                  </motion.div>
                </motion.div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="verify" className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Verify New Skills</h2>

            <motion.div
              className="grid md:grid-cols-3 gap-6"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              {[
                {
                  icon: Award,
                  title: "Take a Test",
                  description: "Complete standardized tests from platforms like HackerRank, Codility",
                  color: "from-blue-500 to-cyan-500",
                  href: "/verify",
                },
                {
                  icon: Users,
                  title: "Peer Verification",
                  description: "Get verified by other professionals in your network",
                  color: "from-green-500 to-emerald-500",
                  href: "/verify",
                },
                {
                  icon: ExternalLink,
                  title: "Project Submission",
                  description: "Submit a project or portfolio for expert review",
                  color: "from-purple-500 to-violet-500",
                  href: "/verify",
                },
              ].map((option, index) => (
                <motion.div
                  key={option.title}
                  variants={staggerItem}
                  whileHover={{
                    scale: 1.05,
                    rotateY: 5,
                    boxShadow: "0 25px 50px rgba(0, 0, 0, 0.3)",
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-gray-800/50 backdrop-blur-sm border-gray-700 h-full">
                    <CardHeader>
                      <motion.div
                        className={`w-12 h-12 rounded-lg bg-gradient-to-r ${option.color} p-3 mb-4`}
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                      >
                        <option.icon className="w-6 h-6 text-white" />
                      </motion.div>
                      <CardTitle className="text-white">{option.title}</CardTitle>
                      <CardDescription className="text-gray-400">{option.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button className={`w-full bg-gradient-to-r ${option.color} hover:opacity-90`} asChild>
                          <Link href={option.href}>
                            <Zap className="w-4 h-4 mr-2" />
                            Get Started
                          </Link>
                        </Button>
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
