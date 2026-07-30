'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import TopBar from '@/components/top-bar'
import Navbar from '@/components/navbar'
import MegaFooter from '@/components/mega-footer'
import { useLanguage } from '@/contexts/language-context'
import { ArrowLeft, Calendar } from 'lucide-react'

interface Post {
  id: number
  title: string
  titleBn: string | null
  content: string
  contentBn: string | null
  coverImage: string | null
  videoUrl: string | null
  createdAt: string
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function JournalPostPage() {
  const params = useParams()
  const postId = params.id as string
  const { lang } = useLanguage()

  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPost() {
      setLoading(true)
      const { data } = await supabase.from('journal_posts').select('*').eq('id', postId).single()
      if (data) {
        setPost({
          id: data.id,
          title: data.title,
          titleBn: data.title_bn,
          content: data.content,
          contentBn: data.content_bn,
          coverImage: data.cover_image,
          videoUrl: data.video_url,
          createdAt: data.created_at,
        })
      }
      setLoading(false)
    }
    fetchPost()
  }, [postId])

  if (loading) {
    return (
      <main>
        <TopBar />
        <Navbar />
        <div className="text-center py-24 text-gray-500">Loading...</div>
        <MegaFooter />
      </main>
    )
  }

  if (!post) {
    return (
      <main>
        <TopBar />
        <Navbar />
        <div className="text-center py-24 text-gray-500">Journal entry not found.</div>
        <MegaFooter />
      </main>
    )
  }

  const displayTitle = lang === 'EN' ? post.title : (post.titleBn || post.title)
  const displayContent = lang === 'EN' ? post.content : (post.contentBn || post.content)

  return (
    <main>
      <TopBar />
      <Navbar />

      <section className="bg-[#F7F4EE] py-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <a href="/journal" className="inline-flex items-center gap-1.5 text-gray-600 hover:text-[#0A5C36] text-sm font-medium mb-6">
            <ArrowLeft className="w-4 h-4" />
            {lang === 'EN' ? 'Back to Journal' : 'জার্নালে ফিরুন'}
          </a>

          <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
            {post.coverImage && (
              <div className="relative h-64 sm:h-80 bg-gray-100">
                <Image src={post.coverImage} alt={post.title} fill className="object-cover" />
              </div>
            )}

            <div className="p-6 sm:p-10">
              <div className="flex items-center gap-1.5 text-gray-400 text-sm mb-3">
                <Calendar className="w-4 h-4" />
                {formatDate(post.createdAt)}
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-6 leading-snug">{displayTitle}</h1>

              {post.videoUrl && (
                <div className="aspect-video rounded-xl overflow-hidden bg-black mb-6">
                  <iframe src={post.videoUrl} className="w-full h-full" allowFullScreen title={post.title} />
                </div>
              )}

              <div className="text-gray-700 leading-relaxed whitespace-pre-line">{displayContent}</div>
            </div>
          </div>
        </div>
      </section>

      <MegaFooter />
    </main>
  )
}
