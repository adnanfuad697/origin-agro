import TopBar from '@/components/top-bar'
import Navbar from '@/components/navbar'
import HeroSection from '@/components/hero-section'
import ExecutiveTeam from '@/components/executive-team'
import ProjectOverview from '@/components/project-overview'
import SustainableTech from '@/components/sustainable-tech'
import InvestorSection from '@/components/investor-section'
import ProductMarketplace from '@/components/product-marketplace'
import FaqSection from '@/components/faq-section'
import MegaFooter from '@/components/mega-footer'
export default function HomePage() {
  return (
    <main>
      <TopBar />
      <Navbar />
      <HeroSection />
      <ProductMarketplace />
      <InvestorSection />
      <ProjectOverview />
      <SustainableTech />
      <ExecutiveTeam />
      <FaqSection />
      <MegaFooter />
    </main>
  )
}
