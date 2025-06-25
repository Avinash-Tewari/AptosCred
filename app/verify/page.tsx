"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Award, Users, ExternalLink, Upload, CheckCircle, Clock, Shield, ArrowLeft, Sparkles, Zap } from "lucide-react"
import Link from "next/link"
import { AnimatedBackground } from "@/components/ui/animated-background"
import { GradientOrb } from "@/components/ui/gradient-orb"
import { fadeInUp, staggerContainer, staggerItem, scaleIn } from "@/lib/animations"

export default function VerifySkills() {
  const [selectedSkill, setSelectedSkill] = useState("")
  const [verificationMethod, setVerificationMethod] = useState("")
  const [activeTab, setActiveTab] = useState("test")

  const skillCategories = [
    "Programming Languages",
    "Web Development",
    "Mobile Development",
    "Data Science",
    "DevOps",
    "Design",
    "Marketing",
    "Project Management",
  ]

  const programmingSkills = ["JavaScript", "Python", "Java", "C++", "Go", "Rust", "TypeScript", "PHP"]

  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
      <AnimatedBackground />
      <GradientOrb size="lg" color="purple" className="top-0 right-0 translate-x-1/2 -translate-y-1/2" />
      <GradientOrb size="md" color="blue" className="bottom-1/3 left-0 -translate-x-1/2" />

      {/* Header */}
      <motion.header
        className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-800"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <motion.div whileHover={{ scale: 1.05, x: -5 }} whileTap={{ scale: 0.95 }}>
              <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white" asChild>
                <Link href="/dashboard">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>
            </motion.div>
            <div className="flex items-center space-x-2">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              >
                <Shield className="w-8 h-8 text-purple-400" />
              </motion.div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Skill Verification
              </span>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          <motion.div className="text-center mb-8" {...fadeInUp}>
            <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Verify Your Skills
            </h1>
            <p className="text-lg text-gray-400">
              Choose how you'd like to verify your skills and earn Soulbound NFT badges
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-3 bg-gray-800/50 border border-gray-700">
                {[
                  { value: "test", icon: Award, label: "Take Test" },
                  { value: "peer", icon: Users, label: "Peer Verification" },
                  { value: "project", icon: ExternalLink, label: "Project Submission" },
                ].map((tab, index) => (
                  <motion.div
                    key={tab.value}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 + 0.4 }}
                  >
                    <TabsTrigger
                      value={tab.value}
                      className="flex items-center space-x-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-300"
                    >
                      <tab.icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </TabsTrigger>
                  </motion.div>
                ))}
              </TabsList>

              <AnimatePresence mode="wait">
                {/* Test Verification */}
                <TabsContent value="test" className="space-y-6">
                  <motion.div
                    key="test"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
                      <CardHeader>
                        <CardTitle className="flex items-center text-white">
                          <Award className="w-6 h-6 mr-2 text-blue-400" />
                          Standardized Testing
                        </CardTitle>
                        <CardDescription className="text-gray-400">
                          Complete tests from verified platforms to earn skill badges automatically
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="skill-category" className="text-gray-300">
                              Skill Category
                            </Label>
                            <Select>
                              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                              <SelectContent className="bg-gray-800 border-gray-600">
                                {skillCategories.map((category) => (
                                  <SelectItem key={category} value={category.toLowerCase()} className="text-white">
                                    {category}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="specific-skill" className="text-gray-300">
                              Specific Skill
                            </Label>
                            <Select>
                              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                                <SelectValue placeholder="Select skill" />
                              </SelectTrigger>
                              <SelectContent className="bg-gray-800 border-gray-600">
                                {programmingSkills.map((skill) => (
                                  <SelectItem key={skill} value={skill.toLowerCase()} className="text-white">
                                    {skill}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h3 className="font-semibold text-white">Available Test Platforms</h3>
                          <motion.div
                            className="grid md:grid-cols-2 gap-4"
                            variants={staggerContainer}
                            initial="initial"
                            animate="animate"
                          >
                            {[
                              {
                                name: "HackerRank",
                                description: "Programming challenges and coding assessments",
                                status: "Integrated",
                                color: "green",
                              },
                              {
                                name: "Codility",
                                description: "Technical screening and coding tests",
                                status: "Integrated",
                                color: "green",
                              },
                              {
                                name: "LeetCode",
                                description: "Algorithm and data structure problems",
                                status: "Coming Soon",
                                color: "yellow",
                              },
                              {
                                name: "Coursera",
                                description: "Course completion certificates",
                                status: "Coming Soon",
                                color: "yellow",
                              },
                            ].map((platform, index) => (
                              <motion.div
                                key={platform.name}
                                variants={staggerItem}
                                whileHover={{
                                  scale: 1.02,
                                  boxShadow: "0 10px 30px rgba(147, 51, 234, 0.2)",
                                }}
                                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                              >
                                <Card className="border-gray-600 bg-gray-700/50 backdrop-blur-sm hover:border-purple-500/50 cursor-pointer transition-all duration-300">
                                  <CardContent className="pt-4">
                                    <div className="flex items-center justify-between mb-2">
                                      <h4 className="font-semibold text-white">{platform.name}</h4>
                                      <Badge
                                        className={
                                          platform.color === "green"
                                            ? "bg-green-600/20 text-green-400 border-green-500/30"
                                            : "bg-yellow-600/20 text-yellow-400 border-yellow-500/30"
                                        }
                                      >
                                        {platform.status}
                                      </Badge>
                                    </div>
                                    <p className="text-sm text-gray-400 mb-4">{platform.description}</p>
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                      <Button
                                        className={`w-full ${
                                          platform.status === "Integrated"
                                            ? "bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
                                            : "bg-gray-600 cursor-not-allowed"
                                        }`}
                                        disabled={platform.status !== "Integrated"}
                                      >
                                        {platform.status === "Integrated" ? (
                                          <>
                                            <Zap className="w-4 h-4 mr-2" />
                                            Start {platform.name} Test
                                          </>
                                        ) : (
                                          "Coming Soon"
                                        )}
                                      </Button>
                                    </motion.div>
                                  </CardContent>
                                </Card>
                              </motion.div>
                            ))}
                          </motion.div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </TabsContent>

                {/* Peer Verification */}
                <TabsContent value="peer" className="space-y-6">
                  <motion.div
                    key="peer"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
                      <CardHeader>
                        <CardTitle className="flex items-center text-white">
                          <Users className="w-6 h-6 mr-2 text-green-400" />
                          Peer Verification
                        </CardTitle>
                        <CardDescription className="text-gray-400">
                          Get endorsed by other professionals in your network
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="skill-to-verify" className="text-gray-300">
                              Skill to Verify
                            </Label>
                            <Input
                              id="skill-to-verify"
                              placeholder="e.g., React Development"
                              className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                            />
                          </div>
                          <div>
                            <Label htmlFor="experience-level" className="text-gray-300">
                              Experience Level
                            </Label>
                            <Select>
                              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                                <SelectValue placeholder="Select level" />
                              </SelectTrigger>
                              <SelectContent className="bg-gray-800 border-gray-600">
                                <SelectItem value="beginner" className="text-white">
                                  Beginner
                                </SelectItem>
                                <SelectItem value="intermediate" className="text-white">
                                  Intermediate
                                </SelectItem>
                                <SelectItem value="advanced" className="text-white">
                                  Advanced
                                </SelectItem>
                                <SelectItem value="expert" className="text-white">
                                  Expert
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="evidence" className="text-gray-300">
                            Evidence/Portfolio Links
                          </Label>
                          <Textarea
                            id="evidence"
                            placeholder="Provide links to your work, GitHub repos, live projects, etc."
                            rows={3}
                            className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                          />
                        </div>

                        <div>
                          <Label htmlFor="peer-addresses" className="text-gray-300">
                            Peer Wallet Addresses
                          </Label>
                          <Textarea
                            id="peer-addresses"
                            placeholder="Enter Aptos wallet addresses of peers who can verify your skill (one per line)"
                            rows={4}
                            className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                          />
                          <p className="text-sm text-gray-500 mt-1">
                            Peers with higher reputation scores carry more weight in verification
                          </p>
                        </div>

                        <motion.div className="bg-blue-900/20 border border-blue-500/30 p-4 rounded-lg" {...scaleIn}>
                          <h4 className="font-semibold text-blue-300 mb-2 flex items-center">
                            <Sparkles className="w-4 h-4 mr-2" />
                            How Peer Verification Works
                          </h4>
                          <ul className="text-sm text-blue-200 space-y-1">
                            <li>• Peers receive a verification request with your evidence</li>
                            <li>• They can approve, reject, or request more information</li>
                            <li>• Higher reputation peers have more verification weight</li>
                            <li>• Minimum 3 approvals needed for skill badge</li>
                          </ul>
                        </motion.div>

                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                            <Users className="w-4 h-4 mr-2" />
                            Send Verification Requests
                          </Button>
                        </motion.div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </TabsContent>

                {/* Project Submission */}
                <TabsContent value="project" className="space-y-6">
                  <motion.div
                    key="project"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
                      <CardHeader>
                        <CardTitle className="flex items-center text-white">
                          <ExternalLink className="w-6 h-6 mr-2 text-purple-400" />
                          Project Submission
                        </CardTitle>
                        <CardDescription className="text-gray-400">
                          Submit a project or portfolio for expert review and verification
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="project-skill" className="text-gray-300">
                              Skill Demonstrated
                            </Label>
                            <Input
                              id="project-skill"
                              placeholder="e.g., Full Stack Development"
                              className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                            />
                          </div>
                          <div>
                            <Label htmlFor="project-type" className="text-gray-300">
                              Project Type
                            </Label>
                            <Select>
                              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                              <SelectContent className="bg-gray-800 border-gray-600">
                                <SelectItem value="web-app" className="text-white">
                                  Web Application
                                </SelectItem>
                                <SelectItem value="mobile-app" className="text-white">
                                  Mobile Application
                                </SelectItem>
                                <SelectItem value="smart-contract" className="text-white">
                                  Smart Contract
                                </SelectItem>
                                <SelectItem value="data-analysis" className="text-white">
                                  Data Analysis
                                </SelectItem>
                                <SelectItem value="design-portfolio" className="text-white">
                                  Design Portfolio
                                </SelectItem>
                                <SelectItem value="other" className="text-white">
                                  Other
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="project-title" className="text-gray-300">
                            Project Title
                          </Label>
                          <Input
                            id="project-title"
                            placeholder="Give your project a descriptive title"
                            className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                          />
                        </div>

                        <div>
                          <Label htmlFor="project-description" className="text-gray-300">
                            Project Description
                          </Label>
                          <Textarea
                            id="project-description"
                            placeholder="Describe what your project does, technologies used, challenges solved..."
                            rows={4}
                            className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                          />
                        </div>

                        <div>
                          <Label htmlFor="project-links" className="text-gray-300">
                            Project Links
                          </Label>
                          <div className="space-y-2">
                            <Input
                              placeholder="Live demo URL (if applicable)"
                              className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                            />
                            <Input
                              placeholder="GitHub repository URL"
                              className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                            />
                            <Input
                              placeholder="Additional documentation URL"
                              className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                            />
                          </div>
                        </div>

                        <div>
                          <Label className="text-gray-300">Project Files/Screenshots</Label>
                          <motion.div
                            className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center bg-gray-800/30"
                            whileHover={{
                              borderColor: "rgb(147, 51, 234)",
                              backgroundColor: "rgba(147, 51, 234, 0.05)",
                            }}
                            transition={{ duration: 0.3 }}
                          >
                            <motion.div
                              animate={{ y: [0, -5, 0] }}
                              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                            >
                              <Upload className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                            </motion.div>
                            <p className="text-gray-400 mb-2">Upload project files, screenshots, or demo videos</p>
                            <p className="text-sm text-gray-500">Drag and drop files here or click to browse</p>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                              <Button
                                variant="outline"
                                className="mt-4 border-gray-600 text-gray-300 hover:bg-gray-700"
                              >
                                <Upload className="w-4 h-4 mr-2" />
                                Choose Files
                              </Button>
                            </motion.div>
                          </motion.div>
                        </div>

                        <motion.div
                          className="bg-purple-900/20 border border-purple-500/30 p-4 rounded-lg"
                          {...scaleIn}
                        >
                          <h4 className="font-semibold text-purple-300 mb-2 flex items-center">
                            <Award className="w-4 h-4 mr-2" />
                            Review Process
                          </h4>
                          <ul className="text-sm text-purple-200 space-y-1">
                            <li>• Projects are reviewed by verified experts in the field</li>
                            <li>• Review typically takes 3-5 business days</li>
                            <li>• You'll receive detailed feedback regardless of outcome</li>
                            <li>• Successful projects earn skill badges and reputation points</li>
                          </ul>
                        </motion.div>

                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <Button className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Submit Project for Review
                          </Button>
                        </motion.div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </TabsContent>
              </AnimatePresence>
            </Tabs>
          </motion.div>

          {/* Verification Status */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
            <Card className="mt-8 bg-gray-800/50 backdrop-blur-sm border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Your Verification Requests</CardTitle>
                <CardDescription className="text-gray-400">
                  Track the status of your ongoing verifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <motion.div className="space-y-4" variants={staggerContainer} initial="initial" animate="animate">
                  {[
                    {
                      title: "React Development - HackerRank Test",
                      time: "2 hours ago",
                      status: "In Progress",
                      icon: Clock,
                      color: "yellow",
                    },
                    {
                      title: "JavaScript - Peer Verification",
                      time: "Completed yesterday",
                      status: "Verified",
                      icon: CheckCircle,
                      color: "green",
                    },
                  ].map((request, index) => (
                    <motion.div
                      key={request.title}
                      variants={staggerItem}
                      whileHover={{ scale: 1.02, x: 10 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    >
                      <div className="flex items-center justify-between p-4 border border-gray-600 rounded-lg bg-gray-700/30">
                        <div className="flex items-center space-x-4">
                          <motion.div
                            animate={request.color === "yellow" ? { rotate: 360 } : {}}
                            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                          >
                            <request.icon
                              className={`w-5 h-5 ${request.color === "yellow" ? "text-yellow-400" : "text-green-400"}`}
                            />
                          </motion.div>
                          <div>
                            <div className="font-semibold text-white">{request.title}</div>
                            <div className="text-sm text-gray-400">{request.time}</div>
                          </div>
                        </div>
                        <Badge
                          className={
                            request.color === "yellow"
                              ? "bg-yellow-600/20 text-yellow-400 border-yellow-500/30"
                              : "bg-green-600/20 text-green-400 border-green-500/30"
                          }
                        >
                          {request.status}
                        </Badge>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
