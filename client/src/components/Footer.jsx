import { TicketIcon } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="px-6 md:px-16 lg:px-36 mt-40 w-full text-gray-300">
            <div className="flex flex-col md:flex-row justify-between w-full gap-10 border-b border-gray-500 pb-14">
                <div className="md:max-w-96">
                    <div className='flex items-center text-3xl tracking-widest mb-4 font-logo'>
                        <span className='text-white'>Quick</span>
                        <span className='text-primary'>Show</span>
                    </div>
                    <p className="mt-6 text-sm">
                        Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                    </p>
                    
                </div>
                <div className="flex-1 flex items-start md:justify-end gap-20 md:gap-40">
                    <div>
                        <h2 className="font-logo font-semibold mb-5 text-lg text-primary">QuickShow</h2>
                        <ul className="text-sm space-y-2">
                            <li><a href="#" className='hover:text-primary transition'>Home</a></li>
                            <li><a href="#" className='hover:text-primary transition'>About us</a></li>
                            <li><a href="#" className='hover:text-primary transition'>Contact us</a></li>
                            <li><a href="#" className='hover:text-primary transition'>Privacy policy</a></li>
                        </ul>
                    </div>
                    <div>
                        <h2 className="font-serif font-semibold mb-5 text-lg text-primary">Get in touch</h2>
                        <div className="text-sm space-y-2">
                            <p>+91 8200341437</p>
                            <p>quickshow78@gmail.com</p>
                        </div>
                    </div>
                </div>
            </div>
            <p className="pt-4 text-center text-sm pb-5">
                Copyright {new Date().getFullYear()} © QuickShow.{/*<a href="https://prebuiltui.com">PrebuiltUI</a>.*/} All Right Reserved.
            </p>
        </footer>
  )
}

export default Footer