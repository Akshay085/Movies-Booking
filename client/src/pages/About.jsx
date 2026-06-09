import React from 'react'
import BlurCircle from '../components/BlurCircle'
import { Film, Volume2, Coffee, Trophy, Star, ShieldCheck } from 'lucide-react'

const About = () => {
  const features = [
    {
      icon: <Film className="w-8 h-8 text-primary" />,
      title: "4K Projection",
      description: "Enjoy high-quality visuals on all screens."
    },
    {
      icon: <Volume2 className="w-8 h-8 text-primary" />,
      title: "Atmos Sound",
      description: "Immersive surround sound for movies."
    },
    {
      icon: <Coffee className="w-8 h-8 text-primary" />,
      title: "Snacks Bar",
      description: "Popcorn, drinks, and snacks available."
    }
  ]

  const milestones = [
    { year: "2026", title: "Design & Interface", text: "Created responsive user interfaces, movie details views, and footer components." },
    { year: "2026", title: "Interactive Bookings", text: "Designed the dynamic seating layouts and mock checkout states." },
    { year: "2026", title: "PWA Integration", text: "Configured offline capability, manifests, and registered service workers." }
  ]

  return (
    <div className="relative min-h-screen pt-32 pb-20 px-6 md:px-16 lg:px-24 xl:px-44 overflow-hidden">
      <BlurCircle top="10%" left="-100px" />
      <BlurCircle bottom="20%" right="-100px" />

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-white tracking-wider mb-4">
          ABOUT <span className="text-primary text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#EAD2A8]">AVR THEATER</span>
        </h1>
        <div className="h-1 w-20 bg-primary mx-auto mb-6 rounded-full"></div>
        <p className="text-gray-300 text-base leading-relaxed font-light">
          AVR Theater is a movie booking application designed as a learning project to explore modern web technologies. We aim to deliver a clean visual interface for movie search, seat selection, and online ticketing features.
        </p>
      </div>

      {/* Features Grid */}
      <div className="mb-20">
        <div className="flex flex-col items-center mb-10">
          <h2 className="text-2xl font-serif text-white tracking-widest mb-1">OUR SERVICES</h2>
          <p className="text-primary text-xs uppercase tracking-widest font-semibold font-sans">Key Features</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {features.map((feat, idx) => (
            <div 
              key={idx} 
              className="bg-surface/60 border border-white/5 hover:border-primary/30 p-6 rounded-xl backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 group"
            >
              <div className="p-3 bg-background/60 rounded-xl w-fit mb-4 border border-white/5">
                {feat.icon}
              </div>
              <h3 className="text-base font-semibold text-white mb-2 group-hover:text-primary transition-colors">
                {feat.title}
              </h3>
              <p className="text-gray-400 text-xs leading-relaxed">
                {feat.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Simplified Timeline */}
      <div>
        <div className="flex flex-col items-center mb-12">
          <h2 className="text-2xl font-serif text-white tracking-widest mb-1">DEVELOPMENT STAGES</h2>
          <p className="text-primary text-xs uppercase tracking-widest font-semibold">Project Milestones</p>
        </div>

        <div className="relative border-l border-white/10 max-w-2xl mx-auto pl-6 space-y-8">
          {milestones.map((milestone, idx) => (
            <div key={idx} className="relative group">
              <div className="absolute -left-[31px] top-1 bg-background border-2 border-primary w-4 h-4 rounded-full shadow-[0_0_6px_#C5A059]"></div>
              <div className="bg-surface/40 p-4 rounded-lg border border-white/5">
                <span className="text-primary font-serif font-bold text-lg block mb-0.5">
                  {milestone.year}
                </span>
                <h3 className="text-sm font-semibold text-white mb-1">
                  {milestone.title}
                </h3>
                <p className="text-gray-400 text-xs">
                  {milestone.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default About
