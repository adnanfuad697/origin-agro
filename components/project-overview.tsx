'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import {
  Sprout, Hotel, Beef, HeartHandshake, BarChart3,
  Leaf, TreePine, Wheat, Fish, Milk, Factory, Building2,
'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/contexts/language-context'
import {
  Sprout, Hotel, Beef, HeartHandshake, BarChart3,
  Leaf, TreePine, Wheat, Fish, Milk, Factory, Building2,
  Truck, ShieldCheck, Users, GraduationCap, Droplet, Sun, Recycle,
  ChevronDown, ChevronUp,
} from 'lucide-react'

const ICONS: Record<string, any> = {
  Sprout, Hotel, Beef, HeartHandshake,
  Leaf, TreePine, Wheat, Fish, Milk, Factory, Building2,
  Truck, ShieldCheck, Users, GraduationCap, Droplet, Sun, Recycle,
}

interface Project {
  id: number
  title: string
  titleBn: string | null
  description: string | null
  descriptionBn: string | null
  tag: string | null
  icon: string
  image: string | null
}

interface ProfitShare {
  id: number
  label: string
  labelBn: string | null
  percentage: number
  color: string
}

const COLOR_MAP: Record<string, string> = {
  orange: 'bg-[#F26522]',
  white30: 'bg-white/30',
  white20: 'bg-white/20',
  green: 'bg-green-400/40',
}

export default function ProjectOverview() {
  const { lang } = useLanguage()
  const [projects, setProjects] = useState<Project[]>([])
  const [shares, setShares] = useState<ProfitShare[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    async function fetchAll() {
      setLoading(true)

      const [projectsRes, sharesRes] = await Promise.all([
        supabase.from('projects').select('*').order('display_order', { ascending: true }),
        supabase.from('profit_shares').select('*').order('display_order', { ascending: true }),
      ])

      if (projectsRes.error) {
        console.error('Error fetching projects:', projectsRes.error)
      } else if (projectsRes.data) {
        const mapped: Project[] = projectsRes.data.map((row: any) => ({
          id: row.id,
          title: row.title,
          titleBn: row.title_bn,
          description: row.description,
          descriptionBn: row.description_bn,
          tag: row.tag,
          icon: row.icon || 'Sprout',
          image: row.image,
        }))
        setProjects(mapped)
        if (mapped.length > 0) {
          setSelectedId(mapped[0].id)
        }
      }

      if (sharesRes.error) {
        console.error('Error fetching profit shares:', sharesRes.error)
      } else if (sharesRes.data) {
        const mapped: ProfitShare[] = sharesRes.data.map((row: any) => ({
          id: row.id,
          label: row.label,
          labelBn: row.label_bn,
          percentage: Number(row.percentage),
          color: row.color || 'white20',
        }))
        setShares(mapped)
      }

      setLoading(false)
    }
    fetchAll()
  }, [])

  // Reset expand when switching project
  useEffect(() => {
    setExpanded(false)
  }, [selectedId])

  const selectedProject = projects.find((p) => p.id === selectedId) || projects[0]

  return (
    <section id="projects" className="py-20 bg-[#F7F4EE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-[#F26522] font-semibold text-sm uppercase tracking-widest mb-2">
            {lang === 'EN' ? 'What We Offer' : 'আমরা কী দিচ্ছি'}
          </p>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 text-balance">
            {lang === 'EN' ? 'Project Overview & Core Segments' : 'প্রকল্পের সারসংক্ষেপ ও মূল বিভাগসমূহ'}
          </h2>
          <p className="text-gray-500 mt-3 max-w-2xl mx-auto leading-relaxed">
            {lang === 'EN'
              ? 'Origin Agro is built on integrated pillars, each designed to be profitable, sustainable, and socially responsible.'
              : 'অরিজিন অ্যাগ্রো একাধিক সমন্বিত স্তম্ভের উপর নির্মিত — প্রতিটি লাভজনক, টেকসই ও সামাজিকভাবে দায়বদ্ধ।'}
          </p>
        </div>

        {loading && (
          <div className="text-center py-14 text-gray-500">
            {lang === 'EN' ? 'Loading projects...' : 'প্রকল্প লোড হচ্ছে...'}
          </div>
        )}

        {!loading && projects.length === 0 && (
          <div className="text-center py-14 text-gray-500">
            {lang === 'EN' ? 'Projects coming soon.' : 'প্রকল্প শীঘ্রই আসছে।'}
          </div>
        )}

        {!loading && projects.length > 0 && selectedProject && (
          <>
            {/* Project Headlines (tabs) */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {projects.map((project) => {
                const isActive = project.id === selectedId
                return (
                  <button
                    key={project.id}
                    onClick={() => setSelectedId(project.id)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-[#0A5C36] text-white shadow-md'
                        : 'bg-white border text-gray-700 hover:border-[#0A5C36]'
                    }`}
                  >
                    {lang === 'EN' ? project.title : (project.titleBn || project.title)}
                  </button>
                )
              })}
            </div>

            {/* Single Project – Landscape Card */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-md mb-14">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                {/* Image */}
                <div className="relative h-64 lg:h-auto min-h-[280px] overflow-hidden">
                  {selectedProject.image ? (
                    <Image
                      src={selectedProject.image}
                      alt={lang === 'EN' ? selectedProject.title : (selectedProject.titleBn || selectedProject.title)}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#0A5C36] to-[#063D24] flex items-center justify-center">
                      {(() => {
                        const Icon = ICONS[selectedProject.icon] || Sprout
                        return <Icon className="w-20 h-20 text-white/25" />
                      })()}
                    </div>
                  )}
                  {selectedProject.tag && (
                    <span className="absolute top-4 left-4 bg-[#F26522] text-white text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full shadow">
                      {selectedProject.tag}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-6 sm:p-8 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-3">
                    {(() => {
                      const Icon = ICONS[selectedProject.icon] || Sprout
                      return (
                        <div className="w-12 h-12 bg-[#0A5C36]/10 rounded-xl flex items-center justify-center">
                          <Icon className="w-6 h-6 text-[#0A5C36]" />
                        </div>
                      )
                    })()}
                    <h3 className="font-extrabold text-gray-900 text-xl sm:text-2xl">
                      {lang === 'EN' ? selectedProject.title : (selectedProject.titleBn || selectedProject.title)}
                    </h3>
                  </div>

                  {(selectedProject.description || selectedProject.descriptionBn) && (
                    <div>
                      <p
                        className={`text-gray-600 text-sm leading-relaxed ${
                          expanded ? '' : 'line-clamp-4'
                        }`}
                      >
                        {lang === 'EN'
                          ? selectedProject.description
                          : (selectedProject.descriptionBn || selectedProject.description)}
                      </p>

                      <button
                        onClick={() => setExpanded(!expanded)}
                        className="mt-3 inline-flex items-center gap-1 text-[#0A5C36] font-semibold text-sm hover:underline"
                      >
                        {expanded
                          ? (lang === 'EN' ? 'See less' : 'কম দেখুন')
                          : (lang === 'EN' ? 'See more' : 'আরও দেখুন')}
                        {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Profit Model Box */}
        <div className="bg-[#0A5C36] rounded-2xl p-8 md:p-10 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#F26522]/20 rounded-full translate-y-1/2 -translate-x-1/4" />
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <BarChart3 className="w-6 h-6 text-[#F26522]" />
                <p className="text-[#F26522] font-bold uppercase text-sm tracking-wider">
                  {lang === 'EN' ? 'Profit Model' : 'মুনাফা মডেল'}
                </p>
              </div>
              <h3 className="text-2xl lg:text-3xl font-extrabold mb-2 text-balance">
                {lang === 'EN'
                  ? 'Shariah-Based Profit Distribution Model'
                  : 'শরিয়াহ-ভিত্তিক মুনাফা বিতরণ মডেল'}
              </h3>
              <p className="text-white/80 leading-relaxed text-sm">
                {lang === 'EN'
                  ? 'Our transparent profit-sharing model is structured under Islamic finance principles (Musharakah). Every investor receives fair, halal returns verified by a certified Shariah board.'
                  : 'আমাদের স্বচ্ছ মুনাফা-বণ্টন মডেল ইসলামিক অর্থায়ন নীতিমালা (মুশারাকা) অনুযায়ী কাঠামোবদ্ধ। প্রতিটি বিনিয়োগকারী একটি স্বীকৃত শরিয়াহ বোর্ড দ্বারা যাচাইকৃত ন্যায্য, হালাল রিটার্ন পান।'}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {shares.map((item) => (
                <div key={item.id} className={`${COLOR_MAP[item.color] || 'bg-white/20'} rounded-xl p-4 text-center`}>
                  <p className="text-3xl font-extrabold">{item.percentage}%</p>
                  <p className="text-xs font-medium mt-1 text-white/90">
                    {lang === 'EN' ? item.label : (item.labelBn || item.label)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
