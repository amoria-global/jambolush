'use client';

import React, { useState, useRef, useEffect } from 'react';

// Define the ChatMessage interface for type safety.
interface ChatMessage {
  id: number;
  text: string;
  sender: 'bot' | 'user';
  timestamp: Date;
}

// Store all Q&As in a structured array for easy matching.
const qaData = [
    // 1. Hosts
    { keywords: ['register host', 'become a host', 'signup as host', 'how do i register as a host'], answer: 'Go to the Jambolush signup page, select “Host” as your account type, and fill in your details.' },
    { keywords: ['documents for host', 'what do i need to host'], answer: 'You’ll need a valid ID, proof of property ownership or rental agreement, and recent utility bills.' },
    { keywords: ['list multiple properties', 'many properties'], answer: 'Yes! Hosts can list as many properties as they own or manage.' },
    { keywords: ['set pricing', 'set rates', 'how much should i charge'], answer: 'You can set your nightly, weekly, or monthly rates in your host dashboard.' },
    { keywords: ['discounts', 'long stays', 'weekly discount', 'monthly discount'], answer: 'Yes, you can configure discounts for weekly or monthly bookings.' },
    { keywords: ['get paid', 'host payment', 'payout', 'pay'], answer: 'Payments are made via bank transfer, PayPal, or mobile money after guest checkout.' },
    { keywords: ['hosting fees', 'host commission'], answer: 'Jambolush charges a small service fee on each booking. The percentage is shown in your host dashboard.' },
    { keywords: ['calendar', 'availability'], answer: 'From your dashboard, you can block or open dates depending on availability.' },
    { keywords: ['reject booking', 'decline booking'], answer: 'Yes, but Jambolush encourages fair hosting. Frequent rejections may lower your host ranking.' },
    { keywords: ['communicate with guests', 'message guest'], answer: 'You can use Jambolush’s secure in-app messaging system.' },
    { keywords: ['upload photos', 'property pictures'], answer: 'Absolutely. High-quality images increase booking chances.' },
    { keywords: ['host insurance'], answer: 'Jambolush offers Host Protection Insurance in case of property damage.' },
    { keywords: ['guest damages', 'damage property'], answer: 'Report it via the support system. The security deposit and insurance cover will assist.' },
    { keywords: ['update listing', 'edit listing'], answer: 'Go to your host dashboard and edit your property details anytime.' },
    { keywords: ['pause listing', 'temporarily disable'], answer: 'Yes, use the “Pause Listing” button in your dashboard.' },
    { keywords: ['provide breakfast', 'offer meals'], answer: 'Not required, but offering extras can attract more guests.' },
    { keywords: ['host reviews'], answer: 'Guests leave reviews after checkout. Positive reviews boost your ranking.' },
    { keywords: ['cancel booking as host'], answer: 'Yes, but frequent cancellations may affect your reputation.' },
    { keywords: ['guest complaints'], answer: 'Guests can open a ticket, and you’ll be notified. Always reply politely and promptly.' },
    { keywords: ['minimum stay', 'minimum nights'], answer: 'Yes, set the minimum number of nights from your dashboard.' },
    { keywords: ['promote my property', 'feature property'], answer: 'Use Jambolush premium listings to feature your property.' },
    { keywords: ['maintenance'], answer: 'Simply mark it as unavailable until it’s ready.' },
    { keywords: ['co-host'], answer: 'Yes, you can add a co-host to help manage bookings.' },
    { keywords: ['verify property'], answer: 'Field agents visit and verify your property details.' },
    { keywords: ['utilities included'], answer: 'You decide. Clearly mention it in your listing.' },
    { keywords: ['extra fees', 'cleaning fee', 'pet fee'], answer: 'Yes, you can add additional charges in your pricing settings.' },
    { keywords: ['payouts processed', 'how fast payout'], answer: 'Within 48 hours after guest checkout.' },
    { keywords: ['tax', 'earnings tax'], answer: 'Hosts are responsible for declaring income taxes according to local laws.' },
    { keywords: ['house rules'], answer: 'Yes, set your own rules (e.g., no smoking, no parties).' },
    { keywords: ['guest doesn’t check out', 'overstay'], answer: 'Contact Jambolush support immediately.' },
    { keywords: ['meet guests in person', 'self check-in'], answer: 'Not always. You can offer self-check-in with locks or codes.' },
    { keywords: ['rent shared rooms'], answer: 'Yes, you can list shared spaces, private rooms, or entire units.' },
    { keywords: ['double bookings'], answer: 'Sync your calendar with external booking platforms to avoid overlaps.' },
    { keywords: ['host support languages'], answer: 'English, French, and more are being added.' },
    { keywords: ['long-term rentals'], answer: 'Yes, Jambolush supports long stays.' },
    { keywords: ['guest breaks rules'], answer: 'You can report them, and penalties may apply.' },
    { keywords: ['increase host ranking'], answer: 'Maintain good reviews, fast responses, and fair pricing.' },
    { keywords: ['host customer support'], answer: 'Yes, via the “Support” section in your dashboard.' },
    { keywords: ['earnings visible'], answer: 'Yes, real-time earnings reports are available.' },
    { keywords: ['deactivate host account'], answer: 'Go to account settings and select “Deactivate.”' },
    //more about hosts to be added later
    // 2. Guests
    { keywords: ['sign up as a guest', 'guest account'], answer: 'Go to the signup page, choose “Guest” as your account type, fill in your details, and verify your email.' },
    { keywords: ['verify my identity as a guest'], answer: 'Yes, Jambolush requires basic ID verification to ensure safe and trustworthy bookings.' },
    { keywords: ['search for properties', 'find a place', 'how do i search for properties'], answer: 'Use the search bar, apply filters like location, price, and property type, then browse listings.' },
    { keywords: ['instant book'], answer: 'Some properties offer “Instant Book.” Others require host approval.' },
    { keywords: ['pay for a booking', 'payment method'], answer: 'Payments can be made securely via credit card, PayPal, or mobile money.' },
    { keywords: ['payment safe', 'is it secure'], answer: 'Yes, Jambolush uses secure payment gateways and doesn’t release funds until after check-in.' },
    { keywords: ['cancel a booking as guest'], answer: 'Yes, but cancellation policies vary by host. Check the property’s rules before booking.' },
    { keywords: ['get a refund'], answer: 'Refunds depend on the host’s cancellation policy (Flexible, Moderate, Strict).' },
    { keywords: ['communicate with the host before booking'], answer: 'Yes, you can send messages to clarify details before confirming your stay.' },
    { keywords: ['guest service fees'], answer: 'Yes, a small service fee is added to bookings to support platform operations.' },
    { keywords: ['check my booking status'], answer: 'Go to your guest dashboard to see confirmed, pending, or past bookings.' },
    { keywords: ['book long-term stays'], answer: 'Yes, Jambolush supports weekly and monthly rentals.' },
    { keywords: ['host cancels my booking'], answer: 'You’ll receive a full refund, and Jambolush will help you find alternative stays.' },
    { keywords: ['reviews for guests'], answer: 'Hosts can leave reviews about guests after their stay, just as guests review hosts.' },
    { keywords: ['see reviews before booking'], answer: 'Yes, all guest and host reviews are visible on property profiles.' },
    { keywords: ['request a refund for a bad experience'], answer: 'File a complaint through your dashboard within 24 hours of check-in.' },
    { keywords: ['bring pets'], answer: 'Only if the host allows it. Check the property’s house rules.' },
    { keywords: ['arrive late to check-in'], answer: 'Inform your host via in-app messaging. Many properties offer flexible or self-check-in.' },
    { keywords: ['extend my stay'], answer: 'Yes, request an extension via your dashboard. Approval depends on host availability.' },
    { keywords: ['property looks different from photos'], answer: 'Report it immediately to Jambolush support. Refunds or relocations may be offered.' },
    { keywords: ['utilities included in booking'], answer: 'It depends on the host’s setup. Always check the property description.' },
    { keywords: ['share my booking with friends'], answer: 'Yes, but all guests should be registered for security purposes.' },
    { keywords: ['pay a deposit'], answer: 'Some properties require a refundable security deposit.' },
    { keywords: ['damage during my stay'], answer: 'Report it immediately. The deposit or insurance may cover costs.' },
    { keywords: ['filter properties by price'], answer: 'Yes, use the price filter in the search options.' },
    { keywords: ['customer support for guests'], answer: 'Yes, 24/7 guest support is available via chat, email, or dashboard.' },
    { keywords: ['book without a credit card'], answer: 'Yes, mobile money or PayPal may be available depending on your region.' },
    { keywords: ['host doesn’t respond'], answer: 'Contact Jambolush support, and we’ll help you secure another property.' },
    { keywords: ['hidden fees for guests'], answer: 'No. All charges, including service and cleaning fees, are shown upfront.' },
    { keywords: ['find pet-friendly properties'], answer: 'Use the “Pet Friendly” filter while searching.' },
    { keywords: ['book experiences with tour guides'], answer: 'Yes, Jambolush also connects guests with verified local tour guides.' },
    { keywords: ['lose my booking confirmation'], answer: 'You can always re-download it from your guest dashboard.' },
    { keywords: ['tip the host'], answer: 'Not required, but always appreciated.' },
    { keywords: ['guest support languages'], answer: 'English, French, and local languages are supported, with more coming soon.' },
    { keywords: ['split payments with friends'], answer: 'Currently, one person pays, but you can share costs privately.' },
    { keywords: ['update my profile information'], answer: 'Go to “Account Settings” in your dashboard.' },
    { keywords: ['guests protected'], answer: 'Yes, Jambolush Guest Protection covers major issues like fraud or misrepresentation.' },
    { keywords: ['book for business trips'], answer: 'Absolutely. Many listings are suited for business travelers.' },
    { keywords: ['deactivate my guest account'], answer: 'From your account settings, select "Deactivate Account."' },
    { keywords: ['private feedback to jambolush'], answer: 'Yes, after your stay, you can send private feedback to help improve the platform.' },
    { keywords: ['check tour availability', 'tour booking', 'book tour'], answer: 'Browse available tours on our tours page, check dates and availability, then proceed with booking. Tours include city tours, cultural experiences, adventure tours, and more.' },
    { keywords: ['pricing display', 'tour pricing', 'property pricing'], answer: 'All prices shown include a 10% service fee and are displayed transparently. There are no hidden fees - what you see is what you pay.' },
    { keywords: ['confirm and pay', 'payment process'], answer: 'After selecting your dates and preferences, you\'ll be taken to a secure payment page where you can review your booking details and complete payment via our approved payment gateways.' },
    { keywords: ['how it works', 'platform process'], answer: 'Getting started is easy: 1) Search & Explore listings 2) Login or Sign up 3) Book & Pay securely 4) Check in & Enjoy your experience. We handle all the details!' },
    { keywords: ['mobile app', 'app features'], answer: 'Jambolush is mobile-friendly and available as both a website and mobile app with features like push notifications, offline access, and seamless booking.' },
    //more about guests to be added later
    // 3. Field Agents
    { keywords: ['who are field agents'], answer: 'Field agents are trusted representatives who verify properties, assist hosts with onboarding, and provide ground support to ensure listings meet Jambolush standards.' },
    { keywords: ['become a field agent'], answer: 'Apply through the “Careers/Field Agents” page, submit your documents, and complete training and background checks.' },
    { keywords: ['field agents full-time or part-time'], answer: 'Both options are available depending on your location and workload demand.' },
    { keywords: ['role of a field agent'], answer: 'Agents verify host properties, take photos, check compliance with safety standards, assist with onboarding, and sometimes help mediate disputes.' },
    { keywords: ['agents get paid'], answer: 'Yes, field agents receive payment per task, verified visit, or commission-based earnings depending on the region.' },
    { keywords: ['agent verify a property'], answer: 'By visiting the location, capturing photos, confirming details like amenities, and submitting a verification report via the Jambolush app.' },
    { keywords: ['agents work in multiple cities'], answer: 'Yes, if approved, agents can cover different cities or regions.' },
    { keywords: ['professional photography skills'], answer: 'Not mandatory, but basic photography helps in capturing quality property images.' },
    { keywords: ['get assigned tasks as an agent'], answer: 'Tasks appear in your agent dashboard based on availability, location, and workload.' },
    { keywords: ['decline a task as agent'], answer: 'Yes, but frequent declines may affect your rating and future assignments.' },
    { keywords: ['agents communicate with hosts'], answer: 'Through the in-app messaging system or direct calls if authorized.' },
    { keywords: ['equipment for agent'], answer: 'A smartphone with a good camera, internet access, and valid identification.' },
    { keywords: ['agent performance measured'], answer: 'Based on completed tasks, host feedback, verification accuracy, and timeliness.' },
    { keywords: ['agents get ratings'], answer: 'Yes, both hosts and the Jambolush team rate agents after completed assignments.' },
    { keywords: ['work as both a host and a field agent'], answer: 'Yes, as long as there’s no conflict of interest.' },
    { keywords: ['payments made to agents'], answer: 'Payments are processed weekly or monthly via bank transfer, PayPal, or mobile money.' },
    { keywords: ['agents pay service fees'], answer: 'No, agents don’t pay fees. They earn directly from Jambolush.' },
    { keywords: ['agent finds a fraudulent property'], answer: 'The agent must report it immediately with evidence, and Jambolush will take action.' },
    { keywords: ['agents recommend improvements'], answer: 'Yes, part of the role is to guide hosts on how to improve their listings.' },
    { keywords: ['training for agents'], answer: 'Online modules, in-person workshops, and regular updates on platform policies.' },
    //more about field-agents to be added later
    // 4. Tour Guides
    { keywords: ['who are tour guides'], answer: 'Tour guides are local experts who offer guided experiences, cultural tours, and activities for guests booking through the platform.' },
    { keywords: ['register as a tour guide', 'become a tour guide', 'how do i become a tour guide'], answer: 'Sign up on the Jambolush platform, select “Tour Guide,” upload your credentials, and complete the verification process.' },
    { keywords: ['documents for guide'], answer: 'A valid ID, proof of residence, and in some regions, a tourism license or certification.' },
    { keywords: ['offer more than one type of tour'], answer: 'Yes, guides can list multiple tours like city walks, adventure trips, or cultural experiences.' },
    { keywords: ['set prices for my tours'], answer: 'You set your own rates based on duration, type, and inclusions. Jambolush provides pricing suggestions to stay competitive.' },
    { keywords: ['guides get rated'], answer: 'Yes, guests leave reviews and star ratings after each tour.' },
    { keywords: ['guests contact guides before booking'], answer: 'Yes, through the in-app messaging system, while personal contact details are protected.' },
    { keywords: ['guides need prior experience'], answer: 'Experience is preferred but not mandatory. Enthusiasm, local knowledge, and professionalism are key.' },
    { keywords: ['schedule my availability as guide'], answer: 'Guides can set available dates and times directly from their dashboard.' },
    { keywords: ['guest cancels tour last minute'], answer: 'The cancellation policy applies, and guides may receive partial compensation depending on the notice period.' },
    { keywords: ['guides work in multiple cities'], answer: 'Yes, if approved and verified for those regions.' },
    { keywords: ['payments work for guides'], answer: 'Payments are transferred securely after the tour is completed, minus Jambolush’s service fee.' },
    { keywords: ['tips allowed for guides'], answer: 'Yes, guests may leave tips through the app or in person.' },
    { keywords: ['guides provide transportation'], answer: 'Yes, if licensed. Otherwise, guides can collaborate with local transport providers.' },
    { keywords: ['attract more bookings as guide'], answer: 'Upload quality photos, write engaging tour descriptions, and maintain excellent reviews.' },
    { keywords: ['guide insurance'], answer: 'Jambolush offers liability coverage for guides during tours.' },
    { keywords: ['guide support languages'], answer: 'Support is available in English, French, and more are being added.' },
    { keywords: ['deactivate guide account'], answer: 'Go to account settings and select "Deactivate."' },
    { keywords: ['freelance tour guide', 'self-employed guide'], answer: 'As a freelance tour guide, you can set your own rates and schedule, maintain direct client relationships, and have complete business autonomy. You\'ll need to upload your National ID for verification.' },
    { keywords: ['company tour guide', 'employed guide'], answer: 'Company tour guides enjoy stable salary and benefits, company-provided training, marketing support, and professional development opportunities. You\'ll need to upload company registration documents.' },
    { keywords: ['tour guide documents', 'guide verification'], answer: 'Freelancers need to upload National ID for verification. Company guides need to upload Company Registration documents. All documents are securely processed.' },
    { keywords: ['guide application process'], answer: 'Choose between freelancer or company guide, fill in your details including services offered (city tours, cultural tours, adventure tours, etc.), upload required documents, and complete verification.' },
    //more about tour-guides to be added later
    // 5. General & Platform
    { keywords: ['hello', 'hi', 'hey', 'greetings', 'good morning', 'good afternoon', 'good evening'], answer: "Hello there! It's great to hear from you. How can I help you with Jambolush today?" },
    { keywords: ['help', 'can you help', 'i need help', 'assistance', 'support'], answer: "Of course! I'm here to help you with anything related to Jambolush. You can ask me about booking stays, listing properties, becoming a tour guide, or any other questions about our platform. What would you like to know?" },
    { keywords: ['thank you', 'thanks', 'thanks a lot', 'thx', 'ty', 'much appreciated'], answer: "You're welcome! I'm here to help do you have any other questions about Jambolush?" },
    { keywords: ['what is jambolush', 'tell me about jambolush', 'about jambolush', 'jambolush platform', 'what does jambolush do', 'explain jambolush', 'jambolush info', 'jambolush information', 'describe jambolush', 'why jambolush', 'more about', 'what jambolush', 'jambolush?', 'jambolush'], answer: 'Jambolush is a comprehensive platform that connects travelers with verified property owners, local hosts, and trusted tourism service providers worldwide. We offer accommodation bookings, guided tours, and authentic travel experiences, making it easy to find your perfect place to stay or explore new destinations.' },
    { keywords: ['who can use jambolush', 'who uses jambolush', 'jambolush users', 'target audience'], answer: 'Anyone looking to book stays, tours, or work as a host, guide, or agent. Whether you\'re a traveler seeking accommodations, a property owner wanting to list, or a local guide offering tours.' },
    { keywords: ['jambolush free to join', 'is jambolush free to join', 'free signup', 'cost to join', 'registration cost', 'free to sign up'], answer: 'Yes, signing up is completely free! Small service fees only apply when you make bookings or earn money through the platform.' },
    { keywords: ['how does jambolush make money', 'jambolush business model', 'revenue model', 'platform fees'], answer: 'Jambolush earns through small service fees on bookings and transactions between users. We only succeed when you do!' },
    { keywords: ['which countries is jambolush available', 'where is jambolush available', 'jambolush locations', 'global availability', 'supported countries'], answer: 'Jambolush is expanding globally, starting with Africa and other travel hotspots. We support multiple languages including English, French, Spanish, Swahili, and Kinyarwanda.' },
    { keywords: ['use jambolush on mobile'], answer: 'Yes, Jambolush is mobile-friendly and available as an app and website.' },
    { keywords: ['jambolush ensure safety'], answer: 'Through ID verification, secure payments, reviews, and a 24/7 support system.' },
    { keywords: ['personal information safe'], answer: 'Yes, Jambolush follows strict data protection and privacy policies.' },
    { keywords: ['payment methods supported'], answer: 'Credit cards, debit cards, PayPal, and mobile money .' },
    { keywords: ['how do refunds work'], answer: 'Refunds depend on the cancellation policy of each booking and are processed securely through the platform.' },
    { keywords: ['contact support anytime'], answer: 'Yes, Jambolush offers 24/7 customer support.' },
    { keywords: ['book tour', 'book house', 'book spot', 'how to book a tour', 'how to book a house', 'how to book a spot', 'reserve tour', 'reserve house', 'reserve spot'], answer: "You can book tours, houses, or spots on Jambolush directly from the platform. Just select what you want, choose your dates, and follow the checkout steps. Need help with a specific booking?" },
    { keywords: ['reset my password'], answer: 'Use the “Forgot Password” option on the login page to reset via email or phone.' },
    { keywords: ['change my role after signup'], answer: 'Yes, you can update your profile to become a Host, Guest, Guide, or Agent.' },
    { keywords: ['jambolush prevent scams'], answer: 'By verifying accounts, monitoring activity, and securing payments inside the platform.' },
    { keywords: ['are reviews real'], answer: 'Yes, only verified guests and users can leave reviews after real transactions.' },
    { keywords: ["how can i register"], answer: "To register on Jambolush, go to the website or app, click 'Sign Up', choose your role (Host, Guest, Tour Guide, or Agent), fill in your details, verify your email or phone, complete your profile, agree to the terms, and start using the platform." },
    { keywords: ['jambolush blog'], answer: 'Visit our blog for travel tips, host stories, and platform updates.' },
    { keywords: ['why login '], answer: 'login to acces your jambolush account you can join as host,field agent,tour-guide, and guest' },
    { keywords: ['jambolush careers', 'work at jambolush', 'job at jambolush'], answer: 'Check the "Careers" page for current openings and application details. We offer remote work opportunities from anywhere in the world!' },
    { keywords: ['jambolush affiliate program', 'affiliate'], answer: 'Yes, join our affiliate program to earn commissions by referring new users.' },
    { keywords: ['become service provider', 'join platform'], answer: 'You can join as a Property Owner, Field Agent, or Tour Guide. Visit our "Become a Host" page to choose your role and start the application process.' },
    { keywords: ['property categories', 'listing types'], answer: 'You can list various property types including Residential Houses, Apartments/Condos, Commercial Properties, Land/Plots, Vacation Rentals, Industrial Properties, Office Spaces, and Retail Spaces.' },
    { keywords: ['tour categories', 'tour types'], answer: 'Tour guides can offer City Tours, Cultural Tours, Nature/Wildlife Tours, Historical Sites, Adventure Tours, Food Tours, Photography Tours, and Custom Tours.' },
    { keywords: ['document upload', 'verification process'], answer: 'All documents are uploaded securely and processed for verification. You can upload JPEG, PNG, or PDF files up to 5MB. We protect your personal information throughout the process.' },
    { keywords: ['countries available', 'global availability'], answer: 'Jambolush is expanding globally, starting with Africa and other travel hotspots. We support multiple languages including English, French, Spanish, Swahili, and Kinyarwanda.' },
    
    // About Jambolush
    { keywords: ['jambolush mission', 'mission', 'company mission', 'what is jambolush mission'], answer: "Our mission is to provide seamless access to versatile living and working spaces that inspire productivity, creativity, and community, making finding and sharing spaces effortless, safe, and enjoyable for everyone." },
    { keywords: ['jambolush vision', 'vision', 'company vision', 'what is jambolush vision'], answer: "Our vision is to become the leading platform for flexible spaces worldwide, where people, teams, and businesses thrive in environments tailored to their needs, enhancing lifestyles and work efficiency." },
    { keywords: ['jambolush values', 'values', 'company values', 'core values', 'principles', 'guiding values'], answer: "Jambolush values innovation, integrity & professionalism, community, excellence, and transparency to ensure efficient, inspiring, and trustworthy experiences for all users and partners." },
    { keywords: ['innovation at jambolush', 'innovation', 'how jambolush innovates'], answer: "Innovation is at the heart of Jambolush. We continuously improve our platform, adopt the latest technology, and create creative solutions to meet evolving user needs." },
    { keywords: ['jambolush integrity', 'integrity', 'how jambolush maintains integrity'], answer: "Integrity is fundamental to Jambolush. We uphold honesty, transparency, and ethical practices in all our interactions with users, partners, and stakeholders." },
    { keywords: [ 'professionalism', 'trust',], answer: "Trust is the foundation at Jambolush. We prioritize transparency, secure processes, and integrity in every decision to provide a dependable platform for users and partners." },
    { keywords: ['community jambolush', 'community', 'collaboration', 'network'], answer: "Jambolush fosters collaboration and meaningful interactions among individuals, teams, and organizations, helping users create value together and build stronger communities." },
    { keywords: ['excellence jambolush', 'excellence', 'high standards', 'quality'], answer: "Excellence guides our approach to service, technology, and user experience. We strive to deliver the highest standards in every interaction and platform experience." },
    { keywords: ['transparency jambolush', 'transparency', 'open information', 'accountability'], answer: "At Jambolush, we provide full visibility into all aspects of the user experience, from property details to booking policies, building trust and confidence for our users and partners." },
    { keywords: ['who jambolush serves', 'partners', 'clients', 'who we serve'], answer: "We partner with startups, enterprises, and non-profit organizations across industries, helping them shape their identity and achieve sustainable growth." },
    { keywords: ['jambolush commitment', 'commitment', 'dedication', 'what jambolush promises'], answer: "Jambolush is committed to delivering high-quality, user-focused solutions through innovation, transparency, and collaboration, consistently exceeding client expectations." },
    { keywords: ['reviews jambolush', 'ratings', 'feedback', 'clutch reviews', 'goodfirms reviews', 'g2 reviews'], answer: "Jambolush has received excellent reviews across Clutch, GoodFirms, and G2, reflecting our commitment to quality, user satisfaction, and dependable service." },
    { keywords: ['home office jambolush', 'home office corner', 'workspace', 'office spaces'], answer: "Jambolush offers flexible home office spaces designed for productivity, comfort, and convenience, catering to individuals and teams." },
    { keywords: ['vacation jambolush', 'vacation spots', 'holiday stays', 'relaxation'], answer: "Jambolush provides unique vacation spaces where users can relax, recharge, and enjoy memorable experiences in inspiring environments." },
    { keywords: ['working hours', 'contact hours', 'support hours'], answer: "Our office hours are Monday - Friday, 9:00 AM - 6:00 PM EAT (East Africa Time). However, our platform support is available 24/7." },
    { keywords: ['office location', 'headquarters'], answer: "Our office is located in Kigali, Rwanda. You can contact us via email at info@jambolush.com or visit our contact page for more details." },
    { keywords: ['getting started guide', 'new user'], answer: "Visit our 'Get Started' page to learn how to use Jambolush based on your role. Whether you're looking to book, host, or guide, we have step-by-step instructions to help you." },
    { keywords: ['sitemap', 'site map', 'site structure', 'website navigation', 'pages list', 'site map roles', 'what pages are on jambolush'], answer: "The Jambolush sitemap serves as a complete guide to all platform sections. It helps users navigate easily to Home, Main Page, About Us, Careers, Press, Blog, Investors, Account (Login, Sign Up, Profile), Trips, Wishlist, Gift Cards, Refer a Friend, Destinations (USA, Europe, Asia, Africa, Oceania, South America), Experiences (Online, Local, Adventure, Culture, Food & Drink), Support & Community (Help Center, FAQ, Contact Support, Safety, Community Guidelines), Partners, Sustainability / ESG, Policies & Legal (Terms, Privacy, Cookies, Refund, Cancellation, Compliance, Disclaimer), Hosting (Become a Host, Hosting Tools, Resources, Host Safety, Hosting Standards, Experiences for Work), and Mobile Apps (iOS, Android, Mobile Web, App Features, Push Notifications)." },
    { keywords: ['jambolush press', 'press', 'media', 'news', 'in the news', 'press kit'], answer: "The Jambolush Press page offers the latest news, media resources, and press kits for journalists and media professionals interested in our platform." },
    
    // jambolush agreements
    { section: "Agreement 1 - Introduction", keywords: ["agreement 1", "first agreement", "introduction"], answer: "The Introduction explains that the Master Agreement governs the relationship between Jambolush and its users. By using the platform, you agree to these terms." },
    { section: "Agreement 2 - Definitions", keywords: ["agreement 2", "second agreement", "definitions"], answer: "Defines key terms like Platform, Host, Guest, Tour Operator, Field Agent, Partner, and Approved Payment Gateway." },
    { section: "Agreement 3 - Scope", keywords: ["agreement 3", "third agreement", "scope"], answer: "The Scope applies to platform use, transactions, service delivery, and compliance by all parties." },
    { section: "Agreement 4 - Registration", keywords: ["agreement 4", "fourth agreement", "registration"], answer: "Users must be at least 18 and provide accurate information when registering." },
    { section: "Agreement 5 - Listing & Booking", keywords: ["agreement 5", "fifth agreement", "listing", "booking"], answer: "Hosts and Operators must ensure listings are accurate; Guests must follow rules when booking." },
    { section: "Agreement 6 - Payments", keywords: ["agreement 6", "sixth agreement", "payments"], answer: "Payments must be made via Approved Payment Gateways. Commissions apply to transactions." },
    { section: "Agreement 7 - Cancellations", keywords: ["agreement 7", "seventh agreement", "cancellations"], answer: "Cancellations must follow the Minimum Refund Policy." },
    { section: "Agreement 8 - Field Agent Services", keywords: ["agreement 8", "eighth agreement", "field agent"], answer: "Field Agents facilitate onboarding, inspections, and local support services." },
    { section: "Agreement 9 - Conduct", keywords: ["agreement 9", "ninth agreement", "conduct"], answer: "Prohibits fraudulent, discriminatory, or illegal activity on the platform." },
    { section: "Agreement 10 - Data Privacy", keywords: ["agreement 10", "tenth agreement", "data privacy"], answer: "Jambolush complies with GDPR, CCPA, and African privacy laws." },
    { section: "Agreement 11 - Liability", keywords: ["agreement 11", "eleventh agreement", "liability"], answer: "Jambolush acts as an intermediary; providers must maintain their own insurance." },
    { section: "Agreement 12 - Disputes", keywords: ["agreement 12", "twelfth agreement", "disputes"], answer: "Disputes are resolved via internal mediation, then UNCITRAL arbitration in Kigali, Rwanda." },
    { section: "Agreement 13 - Governing Law", keywords: ["agreement 13", "thirteenth agreement", "governing law"], answer: "Governed by Rwandan law and international commercial principles." },
    { section: "Agreement 14 - Intellectual Property", keywords: ["agreement 14", "fourteenth agreement", "intellectual property"], answer: "All Jambolush intellectual property is protected by law." },
    { section: "Agreement 15 - Modifications", keywords: ["agreement 15", "fifteenth agreement", "modifications"], answer: "Jambolush provides 30 days’ notice before making changes to agreements." },
    { section: "Agreement 16 - Anti-Discrimination", keywords: ["agreement 16", "sixteenth agreement", "anti-discrimination"], answer: "Discrimination is strictly prohibited across all services." },
    { section: "Agreement 17 - Termination", keywords: ["agreement 17", "seventeenth agreement", "termination"], answer: "Either party may terminate the agreement with notice." },

    // ---------------- Terms & Conditions ----------------
    { section: "Terms 1 - Definitions", keywords: ["terms 1", "first terms and condition", "definitions","1 term"], answer: "Explains terms like Platform, Host, Tour Operator, Guest, Field Agent, User, and Content." },
    { section: "Terms 2 - Scope of Services", keywords: ["terms 2", "second terms and Condition", "scope" ,"2 term"], answer: "Jambolush connects Hosts and Tour Operators with Guests for bookings and experiences." },
    { section: "Terms 3 - Account Registration", keywords: ["terms 3", "third terms and Condition", "account registration","3 term"], answer: "Users must register with accurate details and safeguard their credentials." },
    { section: "Terms 4 - Host & Tour Operator Obligations", keywords: ["fourth terms and Condition", "section 4", "host obligations","4 term"], answer: "Hosts and Operators must keep listings accurate, comply with laws, pay fees, and honor bookings." },
    { section: "Terms 5 - Guest Obligations", keywords: ["terms 5", "fifth terms and Condition", "guest obligations","5 term"], answer: "Guests must provide accurate booking info, respect rules, and avoid damaging property." },
    { section: "Terms 6 - Payments & Fees", keywords: ["terms 6", "sixth terms and Condition", "payments","6 term"], answer: "Payments must go through approved gateways; direct payments are prohibited." },
    { section: "Terms 7 - Cancellations & Refunds", keywords: ["terms 7", "seveneth terms and Condition", "cancellations",'7 term'], answer: "Hosts and Operators must set policies; Jambolush may step in for fraud or safety." },
    { section: "Terms 8 - Policies", keywords: ["terms 8", "eightth terms and Condition", "policies","8 term"], answer: "Includes Privacy, Anti-Discrimination, Field Agent, Content, Security, and Prohibited Activities Policies." },
    { section: "Terms 9 - Intellectual Property", keywords: ["terms 9", "nineth terms and Condition", "intellectual property","9 term"], answer: "All IP is owned by or licensed to Jambolush; unauthorized use is prohibited." },
    { section: "Terms 10 - Indemnity", keywords: ["terms 10", "tenth terms and Condition", "indemnity",'10 term'], answer: "Users must cover claims, damages, or costs caused by their actions or breaches." },
    { section: "Terms 11 - Accessibility Commitment", keywords: ["eleventh terms and Condition", "term 11", "accessibility","11 term"], answer: "Jambolush works to meet accessibility standards for users with disabilities." },
    { section: "Terms 12 - Force Majeure", keywords: ["terms 12", "twelvfth terms and Condition", "force majeure" ,"12 term"], answer: "Jambolush isn't liable for disruptions caused by events beyond its control." },
    { section: "Terms 13 - Third-Party Services", keywords: ["terms 13", "thirteenth terms and Condition", "third-party","13 term"], answer: "Jambolush integrates with third-party providers but isn’t liable for their performance." },
    { section: "Terms 14 - Changes to Platform", keywords: ["terms 14", "fourteenth terms and Condition", "changes","14 term"], answer: "Features may change; major updates will be communicated to users." },
    { section: "Terms 15 - Limitation of Liability", keywords: ["terms 15", "fifteenth terms and Condition", "liability","15 term"], answer: "Liability is limited to the total fees you paid in the last 12 months." },
    { section: "Terms 16 - Dispute Resolution", keywords: ["terms 16", "sixteenth terms and Condition", "dispute","16 term"], answer: "Disputes proceed through negotiation, mediation, then arbitration in Kigali." },
    { section: "Terms 17 - Governing Law", keywords: ["terms 17", "seventeenth terms and Condition", "law","17 term"], answer: "These Terms are governed by the laws of Rwanda." },
    { section: "Terms 18 - Governing Language", keywords: ["terms 18", "eighteenth terms and Condition", "language","18 term"], answer: "The English version of the Terms prevails over translations." },
    { section: "Terms 19 - Global Compliance", keywords: ["terms 19", "nineteenth terms and Condition", "compliance","19 term"], answer: "Jambolush complies with GDPR, CCPA, and African privacy regulations." },
    { section: "Terms 20 - Digital Acceptance", keywords: ["terms 20", "twentieth terms and Condition", "acceptance","20 term"], answer: "By creating an account or using the platform, you accept the Terms." },
    { section: "Terms 21 - Entire Agreement", keywords: ["terms 21", "twenty first terms and Condition", "entire agreement", "21 term"], answer: "These Terms supersede all previous agreements between you and Jambolush." },

    // ---------------- Privacy Policy ----------------
    { section: "Privacy Policy 1 - Scope", keywords: ["Privacy Policy1", "first Privacy Policy ", "scope"], answer: "Applies to all users and governs all personal data collected via the website, app, and integrations." },
    { section: "Privacy Policy 2 - Lawful Basis", keywords: ["Privacy Policy  2", "second Privacy Policy ", "lawful basis"], answer: "Data is processed based on consent, contracts, legal obligations, or legitimate interest." },
    { section: "Privacy Policy 3 - Data Collected", keywords: ["Privacy Policy  3", "third Privacy Policy ", "data collected"], answer: "Collected data includes IDs, contacts, payments, booking history, device info, and verification docs." },
    { section: "Privacy Policy 4 - User Rights", keywords: ["Privacy Policy  4", "fourth Privacy Policy ", "rights"], answer: "Users can access, correct, delete, or restrict data, request portability, or withdraw consent." },
    { section: "Privacy Policy 5 - Data Sharing", keywords: ["Privacy Policy  5", "fifth Privacy Policy ", "sharing"], answer: "Data may be shared with payment processors, field agents, hosting providers, and regulators." },
    { section: "Privacy Policy 6 - Data Security", keywords: ["Privacy Policy  6", "sixth Privacy Policy ", "security"], answer: "Security measures include TLS, AES-256, role-based access, penetration tests, and breach response." },
    { section: "Privacy Policy 7 - Data Retention", keywords: ["Privacy Policy  7", "seventh Privacy Policy ", "retention"], answer: "Booking/tax data is kept up to 7 years. Marketing data is retained until consent is withdrawn." },
    { section: "Privacy Policy 8 - Children's Data", keywords: ["Privacy Policy  8", " eitghtth Privacy Policy ", "children"], answer: "Jambolush does not knowingly collect data from children under 16 without parental consent." },
    { section: "Privacy Policy 9 - Breach Notification", keywords: ["Privacy Policy  9", "nineth Privacy Policy ", "breach"], answer: "Breaches are reported to Rwanda's NCSA, EU authorities, and users without undue delay." },
    { section: "Privacy Policy 10 - Regulatory Registration", keywords: ["Privacy Policy  10", "tenth Privacy Policy ", "regulatory"], answer: "Jambolush is registered with Rwanda's NCSA as a data controller." },
    { section: "Privacy Policy 11 - Contact", keywords: ["Privacy Policy  11", "eleventh Privacy Policy ", "contact"], answer: "Users may contact the Data Protection Officer at info@jambolush.com for rights requests or complaints." },
    { keywords: ["jambolush privacy", "privacy policy", "data protection", "how is my data used", "how is my information protected", "privacy rules", "jambolush data privacy", "personal information safety", "security of my data", "privacy terms", "confidentiality policy", "user data policy", "how does jambolush handle my info", "who can see my data", "privacy guidelines"], answer: "Jambolush takes your privacy seriously. You can learn how your data is collected, used, and protected by visiting our Privacy Policy page. If you have specific questions, our support team is always happy to help!" },

    // Platform features and functionality
    { keywords: ['search properties', 'browse listings', 'property search'], answer: 'Use our search bar to browse properties by location, keywords, or browse by tabs (All, Spot, Stay). You can apply filters like "Under $500", "Pet Friendly", "Parking", "Furnished", or "Near Metro".' },
    { keywords: ['instant book', 'quick booking'], answer: 'Some properties offer Instant Book for immediate reservations, while others require host approval. Look for the instant book badge on listings.' },
    { keywords: ['wishlist', 'save properties', 'favorites'], answer: 'You can save properties to your wishlist by clicking the heart icon. Access your saved properties anytime from your guest dashboard.' },
    { keywords: ['virtual tour', '3d tours'], answer: 'Many properties offer virtual tours and 3D walkthroughs so you can explore spaces before booking. Look for the virtual tour option on property listings.' },
    { keywords: ['property photos', 'view all photos'], answer: 'Click on any property to view detailed photos, or use the "View All Photos" option to see the complete gallery of each listing.' },
    { keywords: ['neighborhood info', 'area information'], answer: 'Each property listing includes neighborhood information, nearby attractions, and local amenities to help you choose the perfect location.' },
    { keywords: ['minimum stay', 'booking duration'], answer: 'Minimum stay requirements vary by property and are set by individual hosts. This information is clearly displayed on each listing.' },
    { keywords: ['guest requirements', 'booking rules'], answer: 'Each property has specific house rules and guest requirements. Always read these carefully before booking to ensure a smooth stay.' },
    { keywords: ['accessibility', 'disabled access'], answer: 'Jambolush is committed to accessibility. Many properties offer accessible features, and you can filter for accessibility options during your search.' },
    { keywords: ['business travel', 'corporate booking'], answer: 'Many of our listings are perfect for business travelers. Look for properties with workspace amenities, reliable wifi, and business-friendly locations.' },
    { keywords: ['tour search', 'find tours', 'browse tours'], answer: 'Browse tours by category (Mountains, National Parks, City Tours, Adventure, Cultural, Wildlife, etc.), search by location, or sort by price and rating to find your perfect experience.' },
    { keywords: ['tour duration', 'how long tours'], answer: 'Tour durations vary from single-day experiences to multi-day adventures. Each tour listing clearly shows the duration and what\'s included.' },
    { keywords: ['bestseller tours', 'popular tours'], answer: 'Look for tours marked with the "Best Seller" badge - these are our most popular and highly-rated experiences chosen by fellow travelers.' },
    { keywords: ['free cancellation', 'cancel tour'], answer: 'Many tours offer free cancellation. Check the cancellation policy on each tour listing for specific terms and conditions.' },
    { keywords: ['tour ratings', 'tour reviews'], answer: 'All tours show ratings and review counts from verified guests. Read detailed reviews to learn about other travelers\' experiences.' },
    { keywords: ['response time', 'support response'], answer: 'Our support team typically responds within a few hours during business hours. For urgent matters, we provide priority support to active bookings.' },
    { keywords: ['cookies', 'cookie policy'], answer: 'We use cookies to improve your experience. You can manage your cookie preferences through our cookie settings. See our Cookie Policy for detailed information.' },
    { keywords: ['newsletter', 'updates', 'subscribe'], answer: 'Subscribe to our newsletter to get exclusive updates, special offers, and travel inspiration delivered to your inbox. You can subscribe from our footer or contact page.' },

    // Common question patterns
    { keywords: ['how do i', 'how to', 'how can i'], answer: 'I can help you with many things on Jambolush! You can ask me about booking stays, listing properties, becoming a host or tour guide, payments, cancellations, or any other platform features. What specifically would you like to know how to do?' },
    { keywords: ['what can i do', 'features', 'capabilities', 'what does this do'], answer: 'Jambolush offers many features! You can book accommodations, find tours, list your property, become a tour guide, search with filters, save favorites, read reviews, and much more. What are you interested in exploring?' },
    { keywords: ['i want to', 'i need to', 'looking for'], answer: 'Great! I can help you with whatever you\'re looking for on Jambolush. Whether you want to book a stay, list a property, find tours, or learn about our services - just let me know what you have in mind!' },
    { keywords: ['problem', 'issue', 'error', 'not working'], answer: 'I\'m sorry to hear you\'re experiencing an issue! For technical problems or account issues, please contact our support team at info@jambolush.com or through the contact page. For general questions about how things work, I\'m happy to help!' },
    { keywords: ['price', 'cost', 'fee', 'expensive', 'cheap'], answer: 'Jambolush pricing varies by property and tour. All prices shown include our 10% service fee with no hidden costs. You can filter by price range to find options that fit your budget. Would you like to know more about pricing for a specific service?' }

];


const JambolushChatbot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      text: "Hi! I'm the Amoria Assistant. Ask me anything about hosting, booking stays, or becoming a guide!",
      sender: 'bot',
      timestamp: new Date(),
    }
  ]);
  const [inputText, setInputText] = useState<string>('');
  const [isMinimized, setIsMinimized] = useState<boolean>(true);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const primaryBlue = '#083A85';
  const primaryPink = '#F20C8F';
  
  const quickQuestions = [
    'How do I register as a host?',
    'How do I search for properties?',
    'How do I become a tour guide?',
    'Is Jambolush free to join?',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (messages.length > 1) {
      scrollToBottom();
    }
  }, [messages]);

  const addMessage = (text: string, sender: 'user' | 'bot') => {
    const newMessage: ChatMessage = {
      id: Date.now() + Math.random(),
      text: text,
      sender: sender,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const getBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase().trim();

    // Find the first matching answer based on keywords.
    // Try exact matches first, then partial matches
    let match = qaData.find(qa =>
      qa.keywords.some(keyword => {
        const keywordLower = keyword.toLowerCase();
        return input === keywordLower || input.includes(keywordLower);
      })
    );

    // If no match found, try more flexible matching for key phrases
    if (!match) {
      match = qaData.find(qa =>
        qa.keywords.some(keyword => {
          const keywordLower = keyword.toLowerCase();
          const inputWords = input.split(' ');
          const keywordWords = keywordLower.split(' ');

          // Check if most keyword words are present in input
          const matchedWords = keywordWords.filter(word =>
            inputWords.some(inputWord => inputWord.includes(word) || word.includes(inputWord))
          );

          return matchedWords.length >= Math.ceil(keywordWords.length * 0.6); // 60% match threshold
        })
      );
    }

    if (match) {
      return match.answer;
    }

    // Improved fallback response with helpful suggestions
    return `I'm not sure about that specific question, but I'd love to help! Here are some things I can assist you with:

• **Booking & Stays**: How to search, book, and manage accommodations
• **Hosting**: Listing properties and becoming a host
• **Tours & Guides**: Finding tours or becoming a tour guide
• **Platform Features**: Search filters, payments, reviews, and more
• **Account Help**: Registration, verification, and settings

Try asking me something like "How do I book a property?" or "Tell me about becoming a host." You can also contact our support team at info@jambolush.com for detailed assistance!`;
  };

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    addMessage(text, 'user');
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      const botResponse = getBotResponse(text);
      addMessage(botResponse, 'bot');
      setIsTyping(false);
    }, 1500);
  };
  
  const handleQuickQuestionClick = (question: string) => {
    handleSendMessage(question);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputText);
    }
  };

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-32 right-4 z-50">
        <button
          onClick={() => setIsMinimized(false)}
          className="w-12 h-12 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 cursor-pointer flex items-center justify-center"
          style={{ backgroundColor: primaryPink }}
        >
          <i className="bi bi-chat-dots-fill text-xl text-white"></i>
        </button>
      </div>
    );
  }

  return (
    <div
      className="fixed bottom-30 left-4 right-4 flex flex-col backdrop-blur-xl rounded-xl shadow-xl transition-all duration-300 
                 sm:left-auto sm:w-full sm:max-w-sm h-[85vh] max-h-[550px] z-50"
      style={{
        backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.8), rgba(15, 23, 42, 0.9)), url('https://images.stockcake.com/public/9/4/d/94dce4db-7571-41c0-b98f-5e67852fd988_large/elephant-river-crossing-stockcake.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Header */}
      <div className="flex-shrink-0 p-3 text-white flex items-center justify-between border-b border-white/10">
        <div className="flex items-center space-x-2">
          <div className="relative w-9 h-9">
            <div className="w-9 h-9 rounded-full flex items-center justify-center bg-blue-800">
              <i className="bi bi-robot text-white text-lg"></i>
            </div>
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-slate-900"></div>
          </div>
          <div className="flex flex-col">
            <h3 className="text-sm font-bold text-white">Amoria Assistant</h3>
            <p className="text-xs text-green-400">Online</p>
          </div>
        </div>
        <button
          onClick={() => setIsMinimized(true)}
          className="text-white/70 hover:text-white transition-colors cursor-pointer"
        >
          <i className="bi bi-x-lg text-base"></i>
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {messages.length === 1 ? (
          <div>
            <div className="flex justify-start">
               <div className="max-w-xs lg:max-w-md p-2.5 rounded-lg shadow-md bg-gray-500/50 text-white rounded-bl-none">
                 <p className="text-xs whitespace-pre-line break-words">{messages[0].text}</p>
              </div>
            </div>
            <p className="text-xs text-white/50 mt-4 mb-2">Quick questions:</p>
            <div className="space-y-1.5">
              {quickQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleQuickQuestionClick(q)}
                  className="w-full text-left p-2 cursor-pointer border border-blue-500/50 text-blue-300 rounded-md text-xs hover:bg-blue-500/20 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs lg:max-w-md p-2.5 rounded-lg shadow-md ${
                message.sender === 'user'
                  ? 'text-white rounded-br-none'
                  : 'bg-gray-800/80 text-white rounded-bl-none'
              }`}
              style={message.sender === 'user' ? { backgroundColor: primaryBlue } : {}}>
                <p className="text-xs whitespace-pre-line break-words">{message.text}</p>
                <span className={`text-[10px] mt-1 block text-right ${message.sender === 'user' ? 'text-blue-100' : 'text-gray-400'}`}>
                  {formatTime(message.timestamp)}
                </span>
              </div>
            </div>
          ))
        )}
        
        {isTyping && (
          <div className="flex justify-start">
             <div className="bg-gray-800/80 p-2.5 rounded-lg shadow-md">
              <div className="flex space-x-1">
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex-shrink-0 p-3 bg-transparent border-t border-white/10">
        <div className="flex space-x-2 items-center">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 py-1.5 px-3 rounded-full bg-slate-800/90 border border-white/10 text-white text-xs resize-none focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
            rows={1}
            style={{ minHeight: '36px', maxHeight: '80px' }}
          />
          <button
            onClick={() => handleSendMessage(inputText)}
            disabled={!inputText.trim()}
            className="w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-full text-white font-semibold transition-all duration-200 hover:shadow-lg disabled:bg-gray-600 disabled:cursor-not-allowed cursor-pointer"
            style={{ backgroundColor: !inputText.trim() ? 'rgb(107 114 128)' : primaryPink }}
          >
            <i className="bi bi-send-fill text-sm"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default JambolushChatbot;