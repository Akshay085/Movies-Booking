import React, { useState, useEffect } from 'react'
import BlurCircle from '../components/BlurCircle'
import { ArrowUp, Shield, Lock, Eye, FileText, CheckCircle, HelpCircle } from 'lucide-react'

const Privacy = () => {
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [activeSection, setActiveSection] = useState('intro')

  const sections = [
    { id: 'intro', title: '1. Introduction', icon: <FileText className="w-4 h-4" /> },
    { id: 'collect', title: '2. Data Collection', icon: <Eye className="w-4 h-4" /> },
    { id: 'usage', title: '3. Data Usage', icon: <CheckCircle className="w-4 h-4" /> },
    { id: 'security', title: '4. Security', icon: <Lock className="w-4 h-4" /> },
    { id: 'cookies', title: '5. Cookies', icon: <Shield className="w-4 h-4" /> },
    { id: 'contact', title: '6. Support', icon: <HelpCircle className="w-4 h-4" /> }
  ]

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setShowScrollTop(true)
      } else {
        setShowScrollTop(false)
      }

      const offsets = sections.map((sec) => {
        const el = document.getElementById(sec.id)
        if (el) {
          return { id: sec.id, offset: el.getBoundingClientRect().top + window.scrollY - 180 }
        }
        return null
      }).filter(Boolean)

      const currentScroll = window.scrollY
      let active = 'intro'
      for (let i = 0; i < offsets.length; i++) {
        if (currentScroll >= offsets[i].offset) {
          active = offsets[i].id
        }
      }
      setActiveSection(active)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (id) => {
    const el = document.getElementById(id)
    if (el) {
      const offset = el.getBoundingClientRect().top + window.scrollY - 120
      window.scrollTo({ top: offset, behavior: 'smooth' })
      setActiveSection(id)
    }
  }

  return (
    <div className="relative min-h-screen pt-32 pb-20 px-6 md:px-16 lg:px-24 xl:px-44 overflow-hidden">
      <BlurCircle top="5%" left="-80px" />
      <BlurCircle bottom="25%" right="-80px" />

      {/* Header */}
      <div className="max-w-4xl mx-auto border-b border-white/10 pb-6 mb-10">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-white tracking-wider mb-2">
          PRIVACY POLICY
        </h1>
        <p className="text-primary text-xs tracking-widest font-semibold font-sans">
          Demo Document for College Project
        </p>
      </div>

      {/* Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-5xl mx-auto">
        
        {/* Left column: Sticky Navigation Sidebar */}
        <div className="hidden lg:block lg:col-span-4 sticky top-28 bg-surface/50 border border-white/5 p-4 rounded-xl backdrop-blur-sm">
          <h3 className="text-sm font-serif text-white tracking-widest mb-3 uppercase">SECTIONS</h3>
          <nav className="space-y-1">
            {sections.map((sec) => (
              <button
                key={sec.id}
                onClick={() => scrollToSection(sec.id)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-xs font-medium transition duration-200 cursor-pointer font-sans ${
                  activeSection === sec.id
                    ? 'bg-primary text-black font-semibold'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                {sec.icon}
                {sec.title}
              </button>
            ))}
          </nav>
        </div>

        {/* Right column: Policy Text */}
        <div className="lg:col-span-8 bg-surface/40 border border-white/5 p-6 md:p-8 rounded-xl backdrop-blur-sm space-y-8">
          
          <section id="intro" className="scroll-mt-32 space-y-2">
            <h2 className="text-xl font-serif text-white tracking-wider border-b border-white/5 pb-1">
              1. Introduction
            </h2>
            <p className="text-gray-300 text-xs md:text-sm leading-relaxed">
              This Privacy Policy explains how our demo movie booking website handles simulated user data. This application is designed solely for educational practice and portfolio demonstration.
            </p>
          </section>

          <section id="collect" className="scroll-mt-32 space-y-2">
            <h2 className="text-xl font-serif text-white tracking-wider border-b border-white/5 pb-1">
              2. Data Collection
            </h2>
            <p className="text-gray-300 text-xs md:text-sm leading-relaxed">
              We do not collect or sell real-world personal information. The site requests temporary mock data (e.g. name, simulated email, seat choices) to demonstrate form handling and booking states.
            </p>
          </section>

          <section id="usage" className="scroll-mt-32 space-y-2">
            <h2 className="text-xl font-serif text-white tracking-wider border-b border-white/5 pb-1">
              3. Data Usage
            </h2>
            <p className="text-gray-300 text-xs md:text-sm leading-relaxed">
              Mock details are used strictly to display booking summaries, render tickets in the UI, and verify react application flows.
            </p>
          </section>

          <section id="security" className="scroll-mt-32 space-y-2">
            <h2 className="text-xl font-serif text-white tracking-wider border-b border-white/5 pb-1">
              4. Security
            </h2>
            <p className="text-gray-300 text-xs md:text-sm leading-relaxed">
              As a front-end practice project, we utilize secure developer sandboxes (like Clerk and Stripe elements) to simulate authentic login and check-out flows without exposing active credentials.
            </p>
          </section>

          <section id="cookies" className="scroll-mt-32 space-y-2">
            <h2 className="text-xl font-serif text-white tracking-wider border-b border-white/5 pb-1">
              5. Cookies
            </h2>
            <p className="text-gray-300 text-xs md:text-sm leading-relaxed">
              We use standard browser local storage and service worker cache systems to retain mock user selections (like favorites) and support offline operations.
            </p>
          </section>

          <section id="contact" className="scroll-mt-32 space-y-2">
            <h2 className="text-xl font-serif text-white tracking-wider border-b border-white/5 pb-1">
              6. Support
            </h2>
            <p className="text-gray-300 text-xs md:text-sm leading-relaxed">
              For any questions regarding the source code, implementation details, or framework utilities used in this demo project, contact the developer at:
            </p>
            <div className="bg-background/80 border border-white/5 rounded-lg p-4 text-xs space-y-1">
              <p className="text-white"><strong className="text-primary font-serif">Email:</strong> avrtheater@gmail.com</p>
              <p className="text-white"><strong className="text-primary font-serif">GitHub:</strong> Akshay085/Movies-Booking</p>
            </div>
          </section>

        </div>
      </div>

      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 p-3 rounded-full bg-primary hover:bg-primary-dull text-black transition duration-300 shadow-md cursor-pointer hover:-translate-y-1 z-50"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}

export default Privacy
