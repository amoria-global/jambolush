'use client';

import React, { useState, ChangeEvent, FormEvent } from 'react';

interface FormData {
  name: string;
  email: string;
  phoneNumber: string;
  message: string;
}

const ContactUsPage = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phoneNumber: '',
    message: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setIsSubmitted(true);
  };

  return (
    <div className="flex items-center justify-center p-4 md:p-8 mx-12 my-8 bg-gradient-to-br from-indigo-200 to-purple-300 font-sans antialiased">
      <div className="w-full max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row transition-all duration-300 transform hover:scale-[1.01]">
        {/* Left column with logo and slogan */}
        <div className="md:w-1/2 bg-white flex flex-col justify-center items-center p-8 md:p-16 text-center text-gray-800">
          {/* image here */}
          <h2 className="text-3xl font-bold mt-6 text-[#3A4D74]">Book Unique.</h2>
          <p className="mt-2 text-3xl font-bold text-[#3A4D74]">Stay Inspired.</p>
        </div>

        {/* Right column with the form */}
        <div className="md:w-1/2 p-8 md:p-12">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">Get in touch</h1>
            <p className="text-gray-500 text-sm text-center leading-relaxed">
              We'd love to hear from you! Whether you have an inquiry, feedback, or need support, our team is ready to assist. Feel free to get in touch.
            </p>
          </header>

          {isSubmitted ? (
            // Success message after submission
            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-6 rounded-lg shadow-md" role="alert">
              <div className="flex items-center">
                <i className="bi bi-check-circle-fill text-xl"></i>
                <div className="ml-3">
                  <p className="font-bold text-lg">Thank you for your message!</p>
                  <p className="text-sm">We have received your submission and will get back to you shortly.</p>
                </div>
              </div>
            </div>
          ) : (
            // Contact form
            <form onSubmit={handleSubmit} className="space-y-6">
              <InputField
                id="name"
                name="name"
                label="Full Name *"
                type="text"
                placeholder="Enter Full Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <InputField
                id="email"
                name="email"
                label="Email *"
                type="email"
                placeholder="Your Email Address"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <InputField
                id="phoneNumber"
                name="phoneNumber"
                label="Phone Number"
                type="tel"
                placeholder="Enter Phone Number"
                value={formData.phoneNumber}
                onChange={handleChange}
              />
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Type Your Message"
                  className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-base transition duration-200"
                ></textarea>
              </div>
              <button
                type="submit"
                aria-label="Send message"
                className="w-full flex items-center justify-center space-x-2 py-3 px-6 border border-transparent rounded-full shadow-lg text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform transition-transform duration-150 active:scale-95"
              >
                <i className="bi bi-send-fill text-base"></i>
                <span>SEND MESSAGE</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

interface InputFieldProps {
  id: string;
  name: string;
  label: string;
  type: string;
  placeholder?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  id,
  name,
  label,
  type,
  placeholder,
  value,
  onChange,
  required = false,
}) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      type={type}
      name={name}
      id={id}
      value={value}
      onChange={onChange}
      required={required}
      placeholder={placeholder}
      className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-base transition duration-200"
    />
  </div>
);

export default ContactUsPage;

