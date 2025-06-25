"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  Shield,
  Star,
  Search,
  Filter,
  ArrowLeft,
  Zap,
  Globe,
  Plus,
} from "lucide-react"
import Link from "next/link"
import { AnimatedBackground } from "@/components/ui/animated-background"
import { GradientOrb } from "@/components/ui/gradient-orb"
import { fadeInUp, staggerContainer, staggerItem } from "@/lib/animations"

export default function JobBoard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const mockJobs = [
    {
      id: 1,
      title: "Senior React Developer",
      company: "TechCorp Inc.",
      location: "Remote",
      type: "Full-time",
      salary: "$80,000 - $120,000",
      requiredSkills: ["React", "TypeScript", "Node.js"],
      requiredReputation: 600,
      escrowAmount: "5000 APT",
      postedDate: "2 days ago",
      applicants: 12,
      description: "We're looking for a senior React developer to join our growing team...",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      id: 2,
      title: "Smart Contract Auditor",
      company: "DeFi Solutions",
      location: "Remote",
      type: "Contract",
      salary: "$100 - $150/hour",
      requiredSkills: ["Solidity", "Move", "Security Auditing"],
      requiredReputation: 800,
      escrowAmount: "10000 APT",
      postedDate: "1 day ago",
      applicants: 5,
      description: "Seeking experienced smart contract auditor for DeFi protocol review...",
      gradient: "from-purple-500 to-violet-500",
    },
    {
      id: 3,
      title: "UI/UX Designer",
      company: "Design Studio",
      location: "New York, NY",
      type: "Part-time",
      salary: "$50 - $75/hour",
      requiredSkills: ["Figma", "UI Design", "User Research"],
      requiredReputation: 400,
      escrowAmount: "2000 APT",
      postedDate: "3 days ago",
      applicants: 8,
      description: "Looking for a creative UI/UX designer to work on mobile app interfaces...",
      gradient: "from-pink-500 to-rose-500",
    },
    {
      id: 4,
      title: "Python Data Scientist",
      company: "Analytics Pro",
      location: "San Francisco, CA",
      type: "Full-time",
      salary: "$90,000 - $130,000",
      requiredSkills: ["Python", "Machine Learning", "SQL"],
      requiredReputation: 650,
      escrowAmount: "7500 APT",
      postedDate: "1 week ago",
      applicants: 15,
      description: "Join our data science team to build predictive models and analytics...",
      gradient: "from-green-500 to-emerald-500",
    },
  ]

  const jobCategories = [
    "All Categories",
    "Development",
    "Design",
    "Data Science",
    "Marketing",
    "Project Management",
    "Blockchain",
  ]

  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
      <AnimatedBackground />
      <GradientOrb size="lg" color="blue" className="top-0 left-0 -translate-x-1/2 -translate-y-1/2" />
      <GradientOrb size="md" color="purple" className="bottom-1/4 right-0 translate-x-1/2" />

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
              <Button variant="ghost" size="sm" className="text-gray-300 hover:to-cyan-500" asChild>
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
                <Briefcase className="w-8 h-8 text-blue-400" />
              </motion.div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Job Board
              </span>
            </div>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700">
              <Plus className="w-4 h-4 mr-2" />
              Post a Job
            </Button>
          </motion.div>
        </div>
      </motion.header>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Search and Filters */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="mb-8 bg-gray-800/50 backdrop-blur-sm border-gray-700">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
                  <Input
                    placeholder="Search jobs by title, company, or skills..."
                    className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full md:w-48 bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    {jobCategories.map((category) => (
                      <SelectItem key={category} value={category.toLowerCase()} className="text-white">
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="w-full md:w-48 bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Job Type" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    <SelectItem value="all" className="text-white">
                      All Types
                    </SelectItem>
                    <SelectItem value="full-time" className="text-white">
                      Full-time
                    </SelectItem>
                    <SelectItem value="part-time" className="text-white">
                      Part-time
                    </SelectItem>
                    <SelectItem value="contract" className="text-white">
                      Contract
                    </SelectItem>
                    <SelectItem value="freelance" className="text-white">
                      Freelance
                    </SelectItem>
                  </SelectContent>
                </Select>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="outline"
                    className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 border-transparent text-white"
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    More Filters
                  </Button>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Job Listings */}
        <div className="space-y-6">
          <motion.div className="flex justify-between items-center" {...fadeInUp}>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Available Jobs
            </h2>
            <p className="text-gray-400">{mockJobs.length} jobs found</p>
          </motion.div>

          <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-6">
            {mockJobs.map((job, index) => (
              <motion.div
                key={job.id}
                variants={staggerItem}
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 25px 50px rgba(0, 0, 0, 0.3)",
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Card className="hover:shadow-lg transition-shadow bg-gray-800/50 backdrop-blur-sm border-gray-700 overflow-hidden">
                  <div className={`h-1 bg-gradient-to-r ${job.gradient}`} />
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl mb-2 text-white">{job.title}</CardTitle>
                        <CardDescription className="text-base">
                          <div className="flex items-center space-x-4 text-gray-400">
                            <span className="font-semibold text-gray-300">{job.company}</span>
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 mr-1" />
                              {job.location}
                            </div>
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {job.type}
                            </div>
                          </div>
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <motion.div
                          className="flex items-center text-green-400 font-semibold mb-1"
                          whileHover={{ scale: 1.05 }}
                        >
                          <DollarSign className="w-4 h-4 mr-1" />
                          {job.salary}
                        </motion.div>
                        <div className="text-sm text-gray-500">{job.postedDate}</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 mb-4">{job.description}</p>

                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2 text-white">Required Skills</h4>
                        <div className="flex flex-wrap gap-2">
                          {job.requiredSkills.map((skill, skillIndex) => (
                            <motion.div
                              key={skill}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: skillIndex * 0.1 }}
                              whileHover={{ scale: 1.1 }}
                            >
                              <Badge variant="secondary" className="bg-gray-700 text-gray-300 hover:bg-gray-600">
                                {skill}
                              </Badge>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      <div className="grid md:grid-cols-3 gap-4 text-sm">
                        <motion.div className="flex items-center" whileHover={{ x: 5 }}>
                          <Shield className="w-4 h-4 mr-2 text-purple-400" />
                          <span className="text-gray-300">Min. Reputation: {job.requiredReputation}</span>
                        </motion.div>
                        <motion.div className="flex items-center" whileHover={{ x: 5 }}>
                          <Star className="w-4 h-4 mr-2 text-yellow-400" />
                          <span className="text-gray-300">Escrow: {job.escrowAmount}</span>
                        </motion.div>
                        <motion.div className="flex items-center" whileHover={{ x: 5 }}>
                          <Briefcase className="w-4 h-4 mr-2 text-blue-400" />
                          <span className="text-gray-300">{job.applicants} applicants</span>
                        </motion.div>
                      </div>

                      <div className="flex justify-between items-center pt-4 border-t border-gray-700">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button variant="outline" className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white hover:bg-gray-700" asChild>
                            <Link href={`/jobs/${job.id}`}>
                              <Globe className="w-4 h-4 mr-2" />
                              View Details
                            </Link>
                          </Button>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button className={`bg-gradient-to-r ${job.gradient} hover:opacity-90`}>
                            <Zap className="w-4 h-4 mr-2" />
                            Apply Now
                          </Button>
                        </motion.div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* How Escrow Works */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-12"
        >
          <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <Shield className="w-6 h-6 mr-2 text-green-400" />
                How Smart Contract Escrow Works
              </CardTitle>
              <CardDescription className="text-gray-400">
                AptosCred uses smart contracts to ensure secure payments for all jobs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <motion.div
                className="grid md:grid-cols-4 gap-6"
                variants={staggerContainer}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
              >
                {[
                  {
                    step: "1",
                    title: "Job Posted",
                    description: "Employer deposits payment into smart contract escrow",
                    color: "from-blue-500 to-cyan-500",
                  },
                  {
                    step: "2",
                    title: "Work Begins",
                    description: "Freelancer is selected and work begins with funds secured",
                    color: "from-purple-500 to-violet-500",
                  },
                  {
                    step: "3",
                    title: "Work Completed",
                    description: "Freelancer submits completed work for review",
                    color: "from-green-500 to-emerald-500",
                  },
                  {
                    step: "4",
                    title: "Payment Released",
                    description: "Smart contract automatically releases payment upon approval",
                    color: "from-orange-500 to-red-500",
                  },
                ].map((item, index) => (
                  <motion.div
                    key={item.step}
                    className="text-center"
                    variants={staggerItem}
                    whileHover={{ scale: 1.05, y: -5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    <motion.div
                      className={`w-12 h-12 rounded-full bg-gradient-to-r ${item.color} flex items-center justify-center mx-auto mb-3 shadow-lg`}
                      whileHover={{
                        boxShadow: "0 20px 40px rgba(147, 51, 234, 0.4)",
                        rotate: 360,
                      }}
                      transition={{
                        boxShadow: { duration: 0.3 },
                        rotate: { duration: 0.6 },
                      }}
                    >
                      <span className="text-xl font-bold text-white">{item.step}</span>
                    </motion.div>
                    <h4 className="font-semibold mb-2 text-white">{item.title}</h4>
                    <p className="text-sm text-gray-400">{item.description}</p>
                  </motion.div>
                ))}
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
