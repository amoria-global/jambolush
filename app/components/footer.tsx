import 'bootstrap-icons/font/bootstrap-icons.css';
import Link from 'next/link';
import { useTranslations } from '../lib/LanguageContext';

interface FooterProps {
  onOpenCookieModal?: () => void;
}

export default function Footer({ onOpenCookieModal }: FooterProps) {
  const t = useTranslations();

  return (
    <footer className="bg-[#0C2D62] text-white">
      <div className="w-full">
        {/* Main Content */}
        <div className="px-6 md:px-12 lg:px-20 py-12 md:py-16">
          <div className="max-w-7xl mx-auto">
            {/* Main Grid - UPDATED FOR A CONSISTENT 2-COLUMN MOBILE/TABLET LAYOUT */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-8 md:gap-12">
              {/* Logo and Tagline - Spans full width on smaller screens */}
              <div className="col-span-2 lg:col-span-1">
                <div className="w-25 h-23 bg-white/0.05 backdrop-blur-sm rounded-l flex items-center justify-center border border-white/10 mb-4">
                  <img src="/favicon.ico" className="w-22 h-19" alt="Jambolush Logo" />
                </div>
                <h3 className="text-lg font-bold mb-2">{t('nav.brandName')}</h3>
                <p className="text-base text-white/80 leading-relaxed">
                  {t('footer.bookU')}<br />{t('footer.bookS')}
                </p>
              </div>

              {/* Quick Links */}
              <div>
                <h3 className="font-bold mb-6 text-base tracking-wider text-white/90">
                  {t('footer.quickLinks').toUpperCase()}
                </h3>
                <ul className="space-y-3">
                  <li>
                    <Link href="/" className="text-base text-white/70 hover:text-white transition-colors duration-200 flex items-center group">
                      <span className="group-hover:translate-x-1 transition-transform duration-200">
                        {t('common.home')}
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/all/how-it-works" className="text-base text-white/70 hover:text-white transition-colors duration-200 flex items-center group">
                      <span className="group-hover:translate-x-1 transition-transform duration-200">
                        {t('common.hiw')}
                      </span>
                    </Link >
                  </li>
                  <li>
                    <Link href="/all/about" className="text-base text-white/70 hover:text-white transition-colors duration-200 flex items-center group">
                      <span className="group-hover:translate-x-1 transition-transform duration-200">
                        {t('common.about')}
                      </span>
                    </Link >
                  </li>
                  <li>
                    <Link href="/all/contact-us" className="text-base text-white/70 hover:text-white transition-colors duration-200 flex items-center group">
                      <span className="group-hover:translate-x-1 transition-transform duration-200">
                        {t('common.contact')}
                      </span>
                    </Link>
                  </li>
                  
                    <li>
                    <Link href="/all/get-started" className="text-base text-white/70 hover:text-white transition-colors duration-200 flex items-center group">
                      <span className="group-hover:translate-x-1 transition-transform duration-200">
                        {t('Get Started')}
                      </span>
                    </Link>
                    
                  </li>
                </ul>
              </div>

              {/* Legal */}
              <div>
                <h3 className="font-bold mb-6 text-base tracking-wider text-white/90">
                  {t('footer.legal').toUpperCase()}
                </h3>
                <ul className="space-y-3">
                  <li>
                    <Link href="/all/terms-and-conditions" className="text-base text-white/70 hover:text-white transition-colors duration-200 flex items-center group">
                      <span className="group-hover:translate-x-1 transition-transform duration-200">
                        {t('footer.termsOfService')}
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/all/privacy-policy" className="text-base text-white/70 hover:text-white transition-colors duration-200 flex items-center group">
                      <span className="group-hover:translate-x-1 transition-transform duration-200">
                        {t('footer.privacyPolicy')}
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/all/Agreement" className="text-base text-white/70 hover:text-white transition-colors duration-200 flex items-center group">
                      <span className="group-hover:translate-x-1 transition-transform duration-200">
                        {t('common.agreement')}
                      </span>
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Contact */}
              <div>
                <h3 className="font-bold mb-6 text-base tracking-wider text-white/90">
                  {t('common.contact').toUpperCase()}
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <i className="bi bi-geo-alt text-white/50 text-base mt-0.5"></i>
                    <p className="text-base text-white/70">Kigali, Rwanda</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <i className="bi bi-envelope text-white/50 text-base mt-0.5"></i>
                    <Link href="mailto:Info@jambolush.com" className="text-base text-white/70 hover:text-white transition-colors duration-200 break-all">
                      Info@jambolush.com
                    </Link>
                  </div>
                  <div className="flex items-start gap-2">
                    <i className="bi bi-telephone text-white/50 text-base mt-0.5"></i>
                    <Link href="tel:+250788437347" className="text-base text-white/70 hover:text-white transition-colors duration-200">
                      +250 788 437 347
                    </Link>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div>
                <h3 className="font-bold mb-6 text-base tracking-wider text-white/90">
                  {t('footer.followUs').toUpperCase()}
                </h3>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="https://www.facebook.com/profile.php?id=61580242676397"
                    className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-[#1877F2] transition-all duration-300 group border border-white/10"
                    aria-label="Facebook"
                  >
                    <i className="bi bi-facebook text-white/70 group-hover:text-white transition-colors"></i>
                  </Link>
                  <Link
                    href="https://www.instagram.com/jambolush/"
                    className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-gradient-to-br hover:from-[#405DE6] hover:via-[#C13584] hover:to-[#F56040] transition-all duration-300 group border border-white/10"
                    aria-label="Instagram"
                  >
                    <i className="bi bi-instagram text-white/70 group-hover:text-white transition-colors"></i>
                  </Link>
                  <Link
                    href="https://x.com/jambolushcom"
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
                    href="https://www.tiktok.com/@jambolush?lang=en-GB"
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
                    {t('footer.stay')} {t('nav.brandName')}
                  </h3>
                  <p className="text-base text-white/70">
                    {t('footer.getUpdates')}
                  </p>
                </div>

                {/* Newsletter Form */}
                <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-3">
                  <div className="relative w-full sm:w-80">
                    <i className="bi bi-envelope absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500"></i>
                    <input
                      type="email"
                      placeholder={t('forms.email')}
                      className="pl-12 pr-6 py-3 bg-white text-gray-800 rounded-full text-base focus:outline-none focus:ring-2 focus:ring-[#F20C8F] focus:ring-offset-2 focus:ring-offset-[#0C2D62] transition-all duration-200 w-full placeholder:text-gray-500"
                    />
                  </div>
                  <button 
                    className="px-8 py-3 bg-[#F20C8F] text-white font-semibold text-base rounded-full hover:bg-[#d00b7d] transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl whitespace-nowrap cursor-pointer flex items-center gap-2 justify-center"
                    onClick={() => console.log('Subscribe clicked')}
                  >
                    {t('footer.subscribeFree')}
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
              <p className="text-base text-white/60">
                {t('footer.copyright')}
              </p>

              <p className="text-base font-medium bg-gradient-to-r from-[#E5E5E5] via-[#C0C0C0] to-[#C0C0C0] bg-clip-text text-transparent">
                Powered by Amoria Global Tech.
              </p>

              <div className="flex items-center gap-6">
                {/* Changed from Link to button to trigger modal */}
                <button 
                  onClick={onOpenCookieModal}
                  className="text-base text-white/60 hover:text-white transition-colors duration-200 cursor-pointer"
                >
                  {t('footer.cookiePolicy')}
                </button>
                <Link href="/all/site-map" className="text-base text-white/60 hover:text-white transition-colors duration-200">
                  {t('footer.sitemap')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}