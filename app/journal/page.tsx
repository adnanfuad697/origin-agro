'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import TopBar from '@/components/top-bar'
import Navbar from '@/components/navbar'
import MegaFooter from '@/components/mega-footer'
import { useLanguage } from '@/contexts/language-context'
import { BookOpen, ArrowRight, Calendar } from 'lucide-react'

interface Post {
  id: number
  title: string
  titleBn: string | null
  excerpt: string | null
  excerptBn: string | null
  coverImage: string | null
  createdAt: string
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function JournalPage() {
  const { lang } = useLanguage()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPosts() {
      setLoading(true)
      const { data, error } = await supabase
        .from('journal_posts')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false })

      if (!error && data) {
        setPosts(data.map((p: any) => ({
          id: p.id,
          title: p.title,
          titleBn: p.title_bn,
          excerpt: p.excerpt,
          excerptBn: p.excerpt_bn,
          coverImage: p.cover_image,
          createdAt: p.created_at,
        })))
      }
      setLoading(false)
    }
    fetchPosts()
  }, [])

  return (
    <main>
      <TopBar />
      <Navbar />

      <section className="bg-[#F7F4EE] py-14 min-h-[60vh]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-[#F26522] font-semibold text-sm uppercase tracking-widest mb-2">
              {lang === 'EN' ? 'From the Farm' : 'খামার থেকে'}
            </p>
            <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900">
              {lang === 'EN' ? 'Journal' : 'জার্নাল'}
            </h1>
            <p className="text-gray-500 mt-2 max-w-xl mx-auto">
              {lang === 'EN'
                ? 'Stories, updates, and behind-the-scenes moments from Origin Agro.'
                : 'অরিজিন অ্যাগ্রোর গল্প, আপডেট এবং পর্দার আড়ালের মুহূর্ত।'}
            </p>
          </div>

          {loading && <div className="text-center py-16 text-gray-500">{lang === 'EN' ? 'Loading...' : 'লোড হচ্ছে...'}</div>}

          {!loading && posts.length === 0 && (
            <div className="bg-white rounded-2xl p-12 text-center shadow-sm max-w-xl mx-auto">
              <BookOpen className="w-14 h-14 text-gray-300 mx-auto mb-4" />
              <h2 className="font-extrabold text-gray-900 text-lg mb-2">
                {lang === 'EN' ? 'No Journal Entries Yet' : 'এখনো কোনো জার্নাল পোস্ট নেই'}
              </h2>
              <p className="text-gray-500 text-sm">
                {lang === 'EN' ? 'Check back soon for stories and updates from the farm.' : 'খামারের গল্প ও আপডেটের জন্য শীঘ্রই আবার দেখুন।'}
              </p>
            </div>
          )}

          {!loading && posts.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <a key={post.id} href={`/journal/${post.id}`} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="relative h-48 bg-gray-100 overflow-hidden">
                    <Image src={post.coverImage || '/placeholder.jpg'} alt={post.title} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/0 to-black/0" />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-2">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(post.createdAt)}
                    </div>
                    <h3 className="font-extrabold text-gray-900 text-lg mb-2 leading-snug group-hover:text-[#0A5C36] transition-colors">
                      {lang === 'EN' ? post.title : (post.titleBn || post.title)}
                    </h3>
                    {(post.excerpt || post.excerptBn) && (
                      <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">{lang === 'EN' ? post.excerpt : (post.excerptBn || post.excerpt)}</p>
                    )}
                    <span className="inline-flex items-center gap-1.5 text-[#0A5C36] font-bold text-sm mt-3">
                      {lang === 'EN' ? 'Read More' : 'আরও পড়ুন'}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </section>

      <MegaFooter />
    </main>
  )
}
