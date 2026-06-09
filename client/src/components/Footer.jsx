import { Link } from 'react-router-dom'
import { TicketIcon } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="px-6 md:px-16 lg:px-36 mt-40 w-full text-gray-300">
            <div className="flex flex-col md:flex-row justify-between w-full gap-10 border-b border-gray-500 pb-14">
                <div className="md:max-w-96">
                    <div className='flex items-center text-3xl tracking-widest mb-4 font-logo'>
                        <span className='text-primary'>AVR</span>
                        <span className='text-white'>Theater</span>
                    </div>
                    <p className="mt-6 text-sm">
                        AVR Theater is a premium multiplex cinema offering the ultimate movie-watching experience with state-of-the-art 4K laser projection, immersive Dolby Atmos surround sound, and gourmet refreshments.
                    </p>
                    
                </div>
                <div className="flex-1 flex flex-wrap items-start md:justify-end gap-10 sm:gap-20 md:gap-40">
                    <div>
                        <h2 className="font-logo font-semibold mb-5 text-lg text-primary">AVR Theater</h2>
                        <ul className="text-sm space-y-2">
                            <li><Link to="/" onClick={() => window.scrollTo(0, 0)} className='hover:text-primary transition'>Home</Link></li>
                            <li><Link to="/about" onClick={() => window.scrollTo(0, 0)} className='hover:text-primary transition'>About us</Link></li>
                            <li><Link to="/contact" onClick={() => window.scrollTo(0, 0)} className='hover:text-primary transition'>Contact us</Link></li>
                            <li><Link to="/privacy" onClick={() => window.scrollTo(0, 0)} className='hover:text-primary transition'>Privacy policy</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h2 className="font-serif font-semibold mb-5 text-lg text-primary">Get in touch</h2>
                        <div className="text-sm space-y-2">
                            <p>+91 8200341437</p>
                            <Link to="mailto:avrtheater@gmail.com" className='hover:text-primary transition'>
                                avrtheater@gmail.com
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <p className="pt-4 text-center text-sm pb-5">
                Copyright {new Date().getFullYear()} © AVR Theater.{/*<a href="https://prebuiltui.com">PrebuiltUI</a>.*/} All Right Reserved.
            </p>
        </footer>
  )
}

export default Footer