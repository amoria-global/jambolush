import 'bootstrap-icons/font/bootstrap-icons.css';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#0C2D62] text-white">
      <div className="w-full">
        {/* Main Content */}
        <div className="px-6 md:px-12 lg:px-20 py-12 md:py-16">
          <div className="max-w-7xl mx-auto">
            {/* Main Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 md:gap-12">
              {/* Logo and Tagline */}
              <div className="lg:col-span-1">
                <div className="w-25 h-23 bg-white/0.05 backdrop-blur-sm rounded-l flex items-center justify-center border border-white/10 mb-4">
                  <img src="/favicon.ico" className="w-22 h-19" alt="Jambolush Logo" />
                </div>
                <h3 className="text-lg font-bold mb-2">JamboLush</h3>
                <p className="text-sm text-white/80 leading-relaxed">
                  Book Unique.<br />Stay Inspired.
                </p>
              </div>

              {/* Quick Links */}
              <div>
                <h3 className="font-bold mb-6 text-sm tracking-wider text-white/90">QUICK LINKS</h3>
                <ul className="space-y-3">
                  <li>
                    <Link href="/" className="text-sm text-white/70 hover:text-white transition-colors duration-200 flex items-center group">
                      <span className="group-hover:translate-x-1 transition-transform duration-200">Home</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/all/how-it-works" className="text-sm text-white/70 hover:text-white transition-colors duration-200 flex items-center group">
                      <span className="group-hover:translate-x-1 transition-transform duration-200">Our Secret Sauce</span>
                    </Link >
                  </li>
                  <li>
                    <Link href="/all/contact-us" className="text-sm text-white/70 hover:text-white transition-colors duration-200 flex items-center group">
                      <span className="group-hover:translate-x-1 transition-transform duration-200">Contact Us</span>
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Legal */}
              <div>
                <h3 className="font-bold mb-6 text-sm tracking-wider text-white/90">LEGAL</h3>
                <ul className="space-y-3">
                  <li>
                    <Link href="all/terms-and-condition" className="text-sm text-white/70 hover:text-white transition-colors duration-200 flex items-center group">
                      <span className="group-hover:translate-x-1 transition-transform duration-200">Terms & Conditions</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-sm text-white/70 hover:text-white transition-colors duration-200 flex items-center group">
                      <span className="group-hover:translate-x-1 transition-transform duration-200">Privacy Policy</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="all/Agreement" className="text-sm text-white/70 hover:text-white transition-colors duration-200 flex items-center group">
                      <span className="group-hover:translate-x-1 transition-transform duration-200">Agreements</span>
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Contact */}
              <div>
                <h3 className="font-bold mb-6 text-sm tracking-wider text-white/90">CONTACT</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <i className="bi bi-geo-alt text-white/50 text-sm mt-0.5"></i>
                    <p className="text-sm text-white/70">Kigali, Rwanda</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <i className="bi bi-envelope text-white/50 text-sm mt-0.5"></i>
                    <Link href="mailto:support@jambolush.com" className="text-sm text-white/70 hover:text-white transition-colors duration-200 break-all">
                      support@jambolush.com
                    </Link>
                  </div>
                  <div className="flex items-start gap-2">
                    <i className="bi bi-telephone text-white/50 text-sm mt-0.5"></i>
                    <Link href="tel:+250788437347" className="text-sm text-white/70 hover:text-white transition-colors duration-200">
                      +250 788 437 347
                    </Link>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div>
                <h3 className="font-bold mb-6 text-sm tracking-wider text-white/90">FOLLOW US</h3>
                <div className="flex flex-wrap gap-3">
                  <Link 
                    href="#" 
                    className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-[#1877F2] transition-all duration-300 group border border-white/10"
                    aria-label="Facebook"
                  >
                    <i className="bi bi-facebook text-white/70 group-hover:text-white transition-colors"></i>
                  </Link>
                  <Link 
                    href="#" 
                    className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-gradient-to-br hover:from-[#405DE6] hover:via-[#C13584] hover:to-[#F56040] transition-all duration-300 group border border-white/10"
                    aria-label="Instagram"
                  >
                    <i className="bi bi-instagram text-white/70 group-hover:text-white transition-colors"></i>
                  </Link>
                  <Link 
                    href="#" 
                    className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-black transition-all duration-300 group border border-white/10"
                    aria-label="Twitter/X"
                  >
                    <i className="bi bi-twitter-x text-white/70 group-hover:text-white transition-colors"></i>
                  </Link>
                  <Link 
                    href="#" 
                    className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-[#0A66C2] transition-all duration-300 group border border-white/10"
                    aria-label="LinkedIn"
                  >
                    <i className="bi bi-linkedin text-white/70 group-hover:text-white transition-colors"></i>
                  </Link>
                  <Link 
                    href="#" 
                    className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-black transition-all duration-300 group border border-white/10"
                    aria-label="TikTok"
                  >
                    <i className="bi bi-tiktok text-white/70 group-hover:text-white transition-colors"></i>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="bg-white/5 backdrop-blur-sm border-t border-white/10">
          <div className="px-6 md:px-12 lg:px-20 py-8 md:py-12">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-12">
                {/* Newsletter Text */}
                <div className="text-center lg:text-left">
                  <h3 className="text-xl md:text-2xl font-bold mb-2">
                    Stay Connected with JamboLush
                  </h3>
                  <p className="text-sm text-white/70">
                    Get exclusive updates, special offers, and travel inspiration delivered to your inbox.
                  </p>
                </div>

                {/* Newsletter Form */}
                <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-3">
  <div className="relative w-full sm:w-80">
    <i className="bi bi-envelope absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
    <input
      type="email"
      placeholder="Enter your email address"
      className="pl-10 pr-6 py-3 bg-white text-gray-800 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#F20C8F] focus:ring-offset-2 focus:ring-offset-[#0C2D62] transition-all duration-200 w-full placeholder:text-gray-500"
    />
  </div>

  <button 
    className="px-8 py-3 bg-[#F20C8F] text-white font-semibold text-sm rounded-full hover:bg-[#d00b7d] transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl whitespace-nowrap cursor-pointer"
    onClick={() => console.log('Subscribe clicked')}
  >
    Subscribe Free
  </button>
</div>

              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="bg-black/20 backdrop-blur-sm">
          <div className="px-6 md:px-12 lg:px-20 py-6">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
              <p className="text-sm text-white/60">
                © 2025 JamboLush. All rights reserved.
              </p>
              <p className="text-sm text-white/60">
                Powered by Amoria Global tech.
              </p>
              <div className="flex items-center gap-6">
                <Link href="#" className="text-sm text-white/60 hover:text-white transition-colors duration-200">
                  Cookies Policy
                </Link>
                <Link href="#" className="text-sm text-white/60 hover:text-white transition-colors duration-200">
                  Sitemap
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}