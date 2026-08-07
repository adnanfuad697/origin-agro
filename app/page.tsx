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
import WhatsAppFloat from '@/components/whatsapp-float'
import MobileBottomBar from '@/components/mobile-bottom-bar'

export default function HomePage() {
  return (
    <main className="pb-16 lg:pb-0">
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
      <WhatsAppFloat />
      <MobileBottomBar />
    </main>
  )
}
