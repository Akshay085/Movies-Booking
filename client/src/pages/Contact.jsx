import React, { useState } from 'react'
import BlurCircle from '../components/BlurCircle'
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react'
import toast from 'react-hot-toast'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all required fields.")
      return
    }

    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      toast.success("Demo Message sent! (Client State Submission)")
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      })
    }, 1000)
  }

  return (
    <div className="relative min-h-screen pt-32 pb-20 px-6 md:px-16 lg:px-24 xl:px-44 overflow-hidden">
      <BlurCircle top="15%" right="-80px" />
      <BlurCircle bottom="10%" left="-120px" />

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-white tracking-wider mb-3">
          CONTACT <span className="text-primary text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#EAD2A8]">AVR THEATER</span>
        </h1>
        <div className="h-1 w-20 bg-primary mx-auto mb-4 rounded-full"></div>
        <p className="text-gray-300 font-light text-sm">
          Have questions or want to leave feedback? Submit the demo form below or contact us via our mock channels.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Contact Information */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-surface/50 border border-white/5 rounded-2xl p-6 backdrop-blur-sm space-y-4">
            <h3 className="text-xl font-serif text-white tracking-wide mb-2">CONTACT INFO</h3>
            
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-background border border-white/5 rounded-lg text-primary mt-1">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest">Phone</p>
                <p className="text-white text-sm mt-0.5">+91 82003 41437</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-background border border-white/5 rounded-lg text-primary mt-1">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest">Email</p>
                <p className="text-white text-sm mt-0.5 hover:text-primary transition">
                  <a href="mailto:avrtheater@gmail.com">avrtheater@gmail.com</a>
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Right Side: Contact Form */}
        <div className="lg:col-span-7 bg-surface/50 border border-white/5 rounded-2xl p-6 backdrop-blur-sm">
          <h3 className="text-xl font-serif text-white tracking-wide mb-4">DEMO FEEDBACK FORM</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">
                  Name <span className="text-primary">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                  className="w-full bg-background border border-white/10 focus:border-primary/80 text-white rounded-lg px-3 py-2.5 text-xs outline-none transition duration-300"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">
                  Email <span className="text-primary">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  required
                  className="w-full bg-background border border-white/10 focus:border-primary/80 text-white rounded-lg px-3 py-2.5 text-xs outline-none transition duration-300"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">
                Subject
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Feedback/Query"
                className="w-full bg-background border border-white/10 focus:border-primary/80 text-white rounded-lg px-3 py-2.5 text-xs outline-none transition duration-300"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">
                Message <span className="text-primary">*</span>
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="4"
                placeholder="Type your message here..."
                required
                className="w-full bg-background border border-white/10 focus:border-primary/80 text-white rounded-lg px-3 py-3 text-xs outline-none transition duration-300 resize-none"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 rounded-lg font-medium text-xs tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer ${
                isSubmitting 
                  ? 'bg-primary-dull text-black/75 cursor-not-allowed' 
                  : 'bg-primary hover:bg-primary-dull text-black hover:-translate-y-0.5'
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-3 h-3" />
                  Submit Feedback
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Contact
