'use client';
import React from 'react';
import { ArrowLeft, MapPin, Phone, Mail, Award, CheckCircle, Lightbulb, Users, Shield, Rocket } from 'lucide-react';
const AboutUsPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-800">
      {/* Header with back button */}
      <header className="container mx-auto px-4 py-8">
        <div className="flex items-center space-x-4">
          <a href="/" className="p-2 rounded-full bg-white shadow-md hover:bg-gray-200"><ArrowLeft size={20} /></a>
          <div className="text-2xl md:text-3xl font-bold">About Us</div>
        </div>
      </header>
      <main className="container mx-auto px-4 space-y-12">
        {/* Our Story Section */}
        <section className="bg-white p-8 rounded-xl shadow-lg text-center">
          <h1 className="text-4xl font-extrabold text-blue-600 mb-4">Our Story</h1>
          <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Jambolush was born out of the need for a smarter, more transparent way to connect property seekers with trusted owners and spaces.
          </p>
        </section>
        {/* Mission and Vision Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Mission */}
          <div className="bg-white p-8 rounded-xl shadow-lg flex flex-col items-center text-center">
            <Rocket size={40} className="text-blue-600 mb-4" />
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed">
              To make renting and booking properties effortless, secure, and accessible across the region.
            </p>
          </div>
          {/* Vision */}
          <div className="bg-white p-8 rounded-xl shadow-lg flex flex-col items-center text-center">
            <Lightbulb size={40} className="text-blue-600 mb-4" />
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Vision</h2>
            <p className="text-gray-600 leading-relaxed">
              We envision a platform that becomes the go-to solution for trusted and seamless property rental experiences in Africa and beyond.
            </p>
          </div>
        </section>
        {/* What We Offer Section */}
        <section className="bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">What We Offer</h2>
          <ul className="list-none space-y-4 text-center text-gray-600">
            <li><CheckCircle className="inline-block text-blue-500 mr-2" /> Verified property listings</li>
            <li><CheckCircle className="inline-block text-blue-500 mr-2" /> Immersive 3D views</li>
            <li><CheckCircle className="inline-block text-blue-500 mr-2" /> Digital payments (Mobile Money, MPESA, cards)</li>
            <li><CheckCircle className="inline-block text-blue-500 mr-2" /> Secure bookings</li>
            <li><CheckCircle className="inline-block text-blue-500 mr-2" /> User-friendly dashboards</li>
          </ul>
        </section>
        {/* Our Values Section */}
        <section className="bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">Our Values</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <Award size={40} className="text-blue-600 mb-2" />
              <p className="font-semibold text-xl">Trust</p>
            </div>
            <div className="flex flex-col items-center">
              <Shield size={40} className="text-blue-600 mb-2" />
              <p className="font-semibold text-xl">Transparency</p>
            </div>
            <div className="flex flex-col items-center">
              <Users size={40} className="text-blue-600 mb-2" />
              <p className="font-semibold text-xl">Inclusivity</p>
            </div>
            <div className="flex flex-col items-center">
              <Lightbulb size={40} className="text-blue-600 mb-2" />
              <p className="font-semibold text-xl">Innovation</p>
            </div>
            <div className="flex flex-col items-center">
              <CheckCircle size={40} className="text-blue-600 mb-2" />
              <p className="font-semibold text-xl">Customer-first approach</p>
            </div>
          </div>
        </section>  
        {/* Who We Serve Section */}
        <section className="bg-white p-8 rounded-xl shadow-lg text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Who We Serve</h2>
          <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed">
            professionals to business owners and travelers — Jambolush is designed for everyone looking for reliable spaces.
          </p>
        </section>   
        {/* Trust & Safety and Our Commitment Sections */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Trust & Safety */}
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Trust & Safety</h2>
            <p className="text-gray-600 leading-relaxed">
              We ensure user confidence through verified listings, secure payments, and ongoing platform monitoring.
            </p>
          </div>
          {/* Our Commitment */}
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Commitment</h2>
            <p className="text-gray-600 leading-relaxed">
              Jambolush is committed to improving access to quality rental experiences through technology and community-focused design.
            </p>
          </div>
        </section>
        {/* Contact Information */}
        <section className="bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">Get in Touch</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <MapPin size={40} className="text-blue-600 mb-2" />
              <p className="font-semibold">Our Office</p>
              <p className="text-gray-600">Kigali, Rwanda</p>
            </div>
            <div className="flex flex-col items-center">
              <Phone size={40} className="text-blue-600 mb-2" />
              <p className="font-semibold">Call Us</p>
              <p className="text-gray-600">+250 788 437 347</p>
            </div>
            <div className="flex flex-col items-center">
              <Mail size={40} className="text-blue-600 mb-2" />
              <p className="font-semibold">Email Us</p>
              <p className="text-gray-600">info@jambolush.com</p>
            </div>
          </div>
        </section>
      </main>     
    </div>
  );
};

export default AboutUsPage;
