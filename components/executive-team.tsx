'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/contexts/language-context'

function LinkedinIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  )
}
function XIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

interface TeamMember {
  id: number
  name: string
  designation: string
  bio: string | null
  image: string | null
  linkedin: string | null
  twitter: string | null
}

export default function ExecutiveTeam() {
  const { lang } = useLanguage()
  const [team, setTeam] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchTeam() {
      setLoading(true)
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .order('display_order', { ascending: true })

      if (error) {
        console.error('Error fetching team members:', error)
      } else if (data) {
        const mapped: TeamMember[] = data.map((row: any) => ({
          id: row.id,
          name: row.name,
          designation: row.role,
          bio: row.bio,
          image: row.image,
          linkedin: row.linkedin_url,
          twitter: row.twitter_url,
        }))
        setTeam(mapped)
      }
      setLoading(false)
    }
    fetchTeam()
  }, [])

  return (
    <section id="team" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-[#F26522] font-semibold text-sm uppercase tracking-widest mb-2">
            {lang === 'EN' ? 'Leadership' : 'নেতৃত্ব'}
          </p>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900">
            {lang === 'EN' ? 'Meet Our Executive Team' : 'আমাদের নির্বাহী দলের সাথে পরিচিত হোন'}
          </h2>
          <p className="text-gray-500 mt-3 max-w-xl mx-auto leading-relaxed">
            {lang === 'EN'
              ? 'Driven by passion for sustainable agriculture and Shariah-compliant investment, our leadership team brings decades of combined expertise.'
              : 'টেকসই কৃষি ও শরিয়াহ-সম্মত বিনিয়োগের প্রতি অনুরাগ নিয়ে আমাদের নেতৃত্ব দল দশকের সম্মিলিত অভিজ্ঞতা নিয়ে এসেছে।'}
          </p>
        </div>

        {loading && (
          <div className="text-center py-10 text-gray-500">
            {lang === 'EN' ? 'Loading team...' : 'টিম লোড হচ্ছে...'}
          </div>
        )}

        {!loading && team.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            {lang === 'EN' ? 'Team members coming soon.' : 'টিম সদস্য শীঘ্রই আসছেন।'}
          </div>
        )}

        {!loading && team.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {team.map((member) => (
              <div key={member.id} className="bg-[#F7F4EE] rounded-2xl p-8 flex flex-col items-center text-center hover:shadow-xl transition-shadow duration-300 border border-gray-100 group">
                <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-[#0A5C36] shadow-lg mb-5 group-hover:border-[#F26522] transition-colors duration-300">
                  <Image src={member.image || '/placeholder.jpg'} alt={`Portrait of ${member.name}`} fill className="object-cover" />
                </div>

                <h3 className="text-xl font-extrabold text-gray-900">{member.name}</h3>
                <p className="text-[#0A5C36] font-semibold text-sm mt-1">{member.designation}</p>

                <div className="w-10 h-0.5 bg-[#F26522] rounded-full my-4" />

                {member.bio && <p className="text-gray-600 text-sm leading-relaxed">{member.bio}</p>}

                {(member.linkedin || member.twitter) && (
                  <div className="flex items-center gap-3 mt-6">
                    {member.linkedin && (
                      <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-[#0A5C36] text-white rounded-full flex items-center justify-center hover:bg-[#F26522] transition-colors" aria-label={`${member.name} LinkedIn`}>
                        <LinkedinIcon />
                      </a>
                    )}
                    {member.twitter && (
                      <a href={member.twitter} target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-[#0A5C36] text-white rounded-full flex items-center justify-center hover:bg-[#F26522] transition-colors" aria-label={`${member.name} X (Twitter)`}>
                        <XIcon />
                      </a>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
