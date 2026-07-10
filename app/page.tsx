import TopBar from '@/components/top-bar'
import Navbar from '@/components/navbar'
import HeroSection from '@/components/hero-section'
import ExecutiveTeam from '@/components/executive-team'
import ProjectOverview from '@/components/project-overview'
import SustainableTech from '@/components/sustainable-tech'
import LivestockShop from '@/components/livestock-shop'
import FaqSection from '@/components/faq-section'
import MegaFooter from '@/components/mega-footer'

export default function HomePage() {
  return (
    <main>
      <TopBar />
      <Navbar />
      <HeroSection />
      <ExecutiveTeam />
      <ProjectOverview />
      <SustainableTech />
      <LivestockShop />
      <FaqSection />
      <MegaFooter />
    </main>
  )
}
