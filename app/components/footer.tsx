import 'bootstrap-icons/font/bootstrap-icons.css';

export default function Footer() {
  return (
    <footer className="bg-[#0C2D62] text-white px-[12px] py-[25px] mx-8">
      <div className="max-w-7xl mx-auto">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {/* Logo and Tagline */}
          <div className="md:col-span-1 flex flex-col items-start">
            <img src="/favicon.ico" className="w-12 h-12 mb-3 rounded-lg bg-white p-2" />
            <p className="text-sm font-medium">Book Unique.<br />Stay Inspired.</p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4 text-sm tracking-wider">QUICK LINKS</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:underline">HOME</a></li>
              <li><a href="#" className="hover:underline">HOW IT WORKS</a></li>
              <li><a href="#" className="hover:underline">CONTACT US</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4 text-sm tracking-wider">LEGAL</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:underline">TERMS & CONDITIONS</a></li>
              <li><a href="#" className="hover:underline">PRIVACY POLICY</a></li>
              <li><a href="#" className="hover:underline">AGREEMENTS</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4 text-sm tracking-wider">CONTACT</h3>
            <div className="space-y-2 text-sm">
              <p>KIGALI, RWANDA</p>
              <a href="mailto:SUPPORT@JAMBOLUSH.COM" className="hover:underline cursor-pointer block">SUPPORT@JAMBOLUSH.COM</a>
              <a href="tel:+250788587420" className="hover:underline cursor-pointer block">+250 788 437 347</a>
            </div>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="font-semibold mb-4 text-sm tracking-wider">SOCIAL MEDIA</h3>
            <div className="flex space-x-3">
              <a href="#" className="bg-[#1877F2] p-2 rounded hover:opacity-80 transition-opacity" aria-label="Facebook">
                <i className="bi bi-facebook text-white text-sm"></i>
              </a>
              <a href="#" className="bg-gradient-to-br from-[#405DE6] via-[#C13584] to-[#F56040] p-2 rounded hover:opacity-80 transition-opacity" aria-label="Instagram">
                <i className="bi bi-instagram text-white text-sm"></i>
              </a>
              <a href="#" className="bg-black p-2 rounded hover:opacity-80 transition-opacity" aria-label="Twitter/X">
                <i className="bi bi-twitter-x text-white text-sm"></i>
              </a>
              <a href="#" className="bg-[#0A66C2] p-2 rounded hover:opacity-80 transition-opacity" aria-label="LinkedIn">
                <i className="bi bi-linkedin text-white text-sm"></i>
              </a>
              <a href="#" className="bg-black p-2 rounded hover:opacity-80 transition-opacity" aria-label="TikTok">
                <i className="bi bi-tiktok text-white text-sm"></i>
              </a>
            </div>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="mt-8 pt-4 mx-12">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between w-full max-w-4xl mx-auto gap-6">
            {/* Left: Bold Message */}
            <div className="md:w-1/2 w-full">
              <p className="font-bold text-white text-left text-base md:text-lg tracking-wider mb-1">
                NEVER MISS ANY JAMBOLUSH'S UPDATE DAY TO DAY :<br className="md:hidden" />
                JOIN JAMBOLUSH COMMUNITY
              </p>
            </div>
            {/* Right: Form */}
            <form className="md:w-1/2 w-full flex flex-col md:flex-row items-start md:items-end gap-2">
              <div className="w-full md:w-auto flex flex-col">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="bg-white text-black p-2 rounded-full w-full md:w-auto focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  required
                />
              </div>
              <button type="submit" className="bg-black text-white font-bold text-sm p-2 rounded-full w-full md:w-auto transition-colors hover:bg-gray-800 cursor-pointer">
                SUBSCRIBE FOR FREE
              </button>
            </form>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-12">
          <hr className="border-t border-white/20 mb-6" />
          <div className="text-center text-sm">
            <p>Copyright© 2025 Jambolush. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}