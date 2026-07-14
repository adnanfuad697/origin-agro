'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import {
  Sprout, Hotel, Beef, HeartHandshake, BarChart3,
  Leaf, TreePine, Wheat, Fish, Milk, Factory, Building2,
  Truck, ShieldCheck, Users, GraduationCap, Droplet, Sun, Recycle,
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
  const [projects, setProjects] = useState<Project[]>([])
  const [shares, setShares] = useState<ProfitShare[]>([])
  const [loading, setLoading] = useState(true)

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

  return (
    <section id="projects" className="py-20 bg-[#F7F4EE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-[#F26522] font-semibold text-sm uppercase tracking-widest mb-2">
            What We Offer / আমরা কী দিচ্ছি
          </p>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 text-balance">
            Project Overview & Core Segments
          </h2>
          <p className="text-[#0A5C36] font-semibold text-base mt-1">প্রকল্পের সারসংক্ষেপ ও মূল বিভাগসমূহ</p>
          <p className="text-gray-500 mt-3 max-w-2xl mx-auto leading-relaxed">
            Origin Agro is built on integrated pillars, each designed to be profitable, sustainable,
            and socially responsible.
          </p>
          <p className="text-gray-400 text-sm mt-1 max-w-2xl mx-auto">
            অরিজিন অ্যাগ্রো একাধিক সমন্বিত স্তম্ভের উপর নির্মিত — প্রতিটি লাভজনক, টেকসই ও সামাজিকভাবে দায়বদ্ধ।
          </p>
        </div>

        {loading && <div className="text-center py-14 text-gray-500">Loading projects...</div>}

        {!loading && projects.length === 0 && (
          <div className="text-center py-14 text-gray-500">Projects coming soon.</div>
        )}

        {!loading && projects.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-14">
            {projects.map((project) => {
              const Icon = ICONS[project.icon] || Sprout
              return (
                <div
                  key={project.id}
                  className="group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                  <div className="relative h-44 overflow-hidden">
                    {project.image ? (
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#0A5C36] to-[#063D24] flex items-center justify-center">
                        <Icon className="w-14 h-14 text-white/25" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/0 to-black/0" />
                    {project.tag && (
                      <span className="absolute top-3 left-3 bg-[#F26522] text-white text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full shadow">
                        {project.tag}
                      </span>
                    )}
                  </div>

                  <div className="relative px-5 pb-6 -mt-8">
                    <div className="w-14 h-14 bg-white rounded-xl shadow-lg flex items-center justify-center mb-3 border border-gray-100">
                      <Icon className="w-7 h-7 text-[#0A5C36]" />
                    </div>
                    <h3 className="font-extrabold text-gray-900 text-lg mb-0.5">{project.title}</h3>
                    {project.titleBn && (
                      <p className="text-[#0A5C36] text-xs font-medium mb-2">{project.titleBn}</p>
                    )}
                    {project.description && (
                      <p className="text-gray-500 text-sm leading-relaxed">{project.description}</p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        <div className="bg-[#0A5C36] rounded-2xl p-8 md:p-10 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#F26522]/20 rounded-full translate-y-1/2 -translate-x-1/4" />
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <BarChart3 className="w-6 h-6 text-[#F26522]" />
                <p className="text-[#F26522] font-bold uppercase text-sm tracking-wider">Profit Model / মুনাফা মডেল</p>
              </div>
              <h3 className="text-2xl lg:text-3xl font-extrabold mb-1 text-balance">
                Shariah-Based Profit Distribution Model
              </h3>
              <p className="text-white/70 text-sm mb-2">শরিয়াহ-ভিত্তিক মুনাফা বিতরণ মডেল</p>
              <p className="text-white/80 leading-relaxed text-sm">
                Our transparent profit-sharing model is structured under Islamic finance principles (Musharakah).
                Every investor receives fair, halal returns verified by a certified Shariah board.
              </p>
              <p className="text-white/60 text-xs leading-relaxed mt-2">
                আমাদের স্বচ্ছ মুনাফা-বণ্টন মডেল ইসলামিক অর্থায়ন নীতিমালা (মুশারাকা) অনুযায়ী কাঠামোবদ্ধ।
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {shares.map((item) => (
                <div key={item.id} className={`${COLOR_MAP[item.color] || 'bg-white/20'} rounded-xl p-4 text-center`}>
                  <p className="text-3xl font-extrabold">{item.percentage}%</p>
                  <p className="text-xs font-medium mt-1 text-white/90">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
