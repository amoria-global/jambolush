'use client';
import React, { useState, ChangeEvent } from 'react';
import { useTranslations } from '../lib/LanguageContext';

const ContactUs: React.FC = () => {
  const t = useTranslations();
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    message: ''
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const isFormValid = formData.fullName && formData.email && formData.message;

  const handleSubmit = () => {
    if (!isFormValid) return; // extra safety

    console.log('Form submitted:', formData);

    // Show modal
    setIsModalOpen(true);

    // Clear form
    setFormData({ fullName: '', email: '', phone: '', message: '' });
  };

  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="min-h-screen bg-white px-4 sm:px-6 lg:px-12 pt-12">
      {/* Header Section */}
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mt-4 sm:mt-6 md:mt-8 mb-2">
          {t('contact.header.title')}
        </h1>
        <p className="text-base sm:text-base md:text-lg mt-2 sm:mt-4 mb-6 text-black max-w-xl mx-auto leading-relaxed">
          {t('contact.header.description')}
        </p>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 sm:mb-12">
        {/* Left Column */}
        <div className="space-y-6 lg:mr-4">
          {/* Contact Info Card */}
          <div className="bg-[#182237] rounded-2xl p-4 sm:p-6 md:p-8 text-white mb-6">
            <h2 className="text-xl sm:text-2xl font-bold mb-6">
              {t('contact.info.title')}
            </h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center bg-pink-600">
                  <i className="bi bi-envelope-fill text-white text-base sm:text-lg"></i>
                </div>
                <div>
                  <p className="text-base sm:text-base font-semibold">{t('contact.info.email.label')}</p>
                  <p className="text-gray-300 text-base sm:text-base">info@jambolush.com</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center bg-pink-600">
                  <i className="bi bi-telephone-fill text-white text-base sm:text-lg"></i>
                </div>
                <div>
                  <p className="text-base sm:text-base font-semibold">{t('contact.info.phone.label')}</p>
                  <p className="text-gray-300 text-base sm:text-base">+250 788 437 347</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center bg-pink-600">
                  <i className="bi bi-geo-alt-fill text-white text-base sm:text-lg"></i>
                </div>
                <div>
                  <p className="text-base sm:text-base font-semibold">{t('contact.info.office.label')}</p>
                  <p className="text-gray-300 text-base sm:text-base">{t('contact.info.office.location')}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center bg-pink-600">
                  <i className="bi bi-clock-fill text-white text-base sm:text-lg"></i>
                </div>
                <div>
                  <p className="text-base sm:text-base font-semibold">{t('contact.info.hours.label')}</p>
                  <p className="text-gray-300 text-base sm:text-base">{t('contact.info.hours.days')}</p>
                  <p className="text-gray-300 text-base sm:text-base">{t('contact.info.hours.time')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-[#182237] rounded-2xl p-4 sm:p-6 text-center text-white">
              <h3 className="text-2xl sm:text-3xl font-bold text-pink-500 mb-1">24h</h3>
              <p className="text-gray-300 text-base sm:text-base">{t('contact.stats.responseTime')}</p>
            </div>
            <div className="bg-[#182237] rounded-2xl p-4 sm:p-6 text-center text-white">
              <h3 className="text-2xl sm:text-3xl font-bold text-pink-500 mb-1">100+</h3>
              <p className="text-gray-300 text-base sm:text-base">{t('contact.stats.happyClients')}</p>
            </div>
          </div>
        </div>

        {/* Right Column - Form */}
        <div className="bg-[#182237] rounded-2xl p-4 sm:p-6 md:p-8 text-white lg:ml-4 mb-8 sm:mb-12">
          <h2 className="text-xl sm:text-2xl font-bold mb-6">{t('contact.form.title')}</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-base font-medium mb-1">
                {t('contact.form.fullName.label')} <span className="text-pink-500">*</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder={t('contact.form.fullName.placeholder')}
                className="w-full px-3 py-2 bg-slate-600 border border-slate-600 rounded-md focus:outline-none focus:border-pink-500 text-base sm:text-base"
              />
            </div>

            <div>
              <label className="block text-base font-medium mb-1">
                {t('contact.form.email.label')} <span className="text-pink-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder={t('contact.form.email.placeholder')}
                className="w-full px-3 py-2 bg-slate-600 border border-slate-600 rounded-md focus:outline-none focus:border-pink-500 text-base sm:text-base"
              />
            </div>

            <div>
              <label className="block text-base font-medium mb-1">
                {t('contact.form.phone.label')} <span className="text-gray-400">{t('contact.form.phone.optional')}</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder={t('contact.form.phone.placeholder')}
                className="w-full px-3 py-2 bg-slate-600 border border-slate-600 rounded-md focus:outline-none focus:border-pink-500 text-base sm:text-base"
              />
            </div>

            <div>
              <label className="block text-base font-medium mb-1">
                {t('contact.form.message.label')} <span className="text-pink-500">*</span>
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder={t('contact.form.message.placeholder')}
                rows={5}
                className="w-full px-3 py-2 bg-slate-600 border border-slate-600 rounded-md focus:outline-none focus:border-pink-500 text-base sm:text-base resize-none"
              />
              <p className="text-base text-gray-400 mt-1">{formData.message.length} {t('contact.form.message.characters')}</p>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={!isFormValid}
              className={`w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 sm:py-3 px-4 rounded-md transition-colors duration-200 flex items-center justify-center space-x-2 text-base sm:text-base
                ${!isFormValid ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <i className="bi bi-send-fill"></i>
              <span>{t('contact.form.sendButton')}</span>
            </button>

            <p className="text-base text-gray-400 text-center mt-2 sm:mt-4">
              {t('contact.form.privacyNote')}
            </p>
          </div>
        </div>
      </div>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center px-4 sm:px-6">
          <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6 text-center">
            <h3 className="text-lg sm:text-xl font-bold mb-4 text-pink-600">
              {t('contact.modal.title')}
            </h3>
            <p className="text-base sm:text-base mb-6">
              {t('contact.modal.message')}
            </p>
            <button
              onClick={closeModal}
              className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 px-4 rounded transition-colors"
            >
              {t('contact.modal.closeButton')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactUs;