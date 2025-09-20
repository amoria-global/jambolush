"use client";
import React, { useState } from 'react';

// DATA: This remains the same as the previous version.
const rolesData = [
  {
    key: 'guest',
    icon: 'bi bi-person',
    title: 'Guests',
    description: 'Explore unique homes, tours, and experiences. Book your stay, manage your trips, and travel with ease.',
    steps: [
      { text: 'Start by creating your account on the Jambolush website find “signup” button on Home'},
      { text: 'After signing in, navigate to "Profile" to choose “edit profile” to add a photo and your personal information.', image: '/guest/pic1.png' },
      { text: 'Go to the "Payments" tab to securely add your preferred payment method for easy booking.', image: '' },
      { text: 'Visit "Settings" to configure your notification preferences and other account details.', image: '/guest/pic2.png' },
      { text: 'From the Home page, use the main search bar by selecting Stay for "accommodations" or "Spot" for points of interest. Enter a location and keywords to find what you are looking for. For guided activities, click the "Find a Tour" button in the top menu.', image: '/guest/pic3.png' },
      { text: 'When you find something you love, save it to your "Wishlist" to compare your favorite options.', image: '/guest/pic4.png' },
      { text: 'Once you are ready, select your dates and complete your reservation.', image: '/guest/pic5.png' },
      { text: 'FOR TOUR:Once you are ready, complete your reservation by placing “BOOK NOW” button', image:'/guest/pic6.png'},
      { text: 'After BOOK NOW and PRESERVE you can go to complete the payment process', image:'/guest/pic7.png'},
      { text: 'After booking, find all your trip details and manage your stay under "My Bookings".', image: '/guest/pic8.png' },
      { text: 'Use the "Schedule" tab to see a convenient calendar view of all your upcoming trips.', image: '/guest/pic9.png' },
      { text: 'If you ever need help, the "Help & Support" section is available to assist you.', image: '/guest/pic10.png' },
    ],
    tip: 'Unlock travel rewards! Invite friends to Jambolush to earn credits to use Gift Cards to make booking even easier.',
  },
  {
    key: 'property owner',
    icon: 'bi bi-briefcase',
    title: 'Property owner',
    description: 'List your properties, connect with potential buyers or renters, and manage your real estate portfolio',
    steps: [
      { text: 'Begin by clicking the “become a host” button and selecting "Property Owner" as your role', image: '/host/pic1.png' },
      { text: 'Complete the application form with your required details.'},
      { text: 'Submit the application and set a secure password for your account.' },
      { text: 'Wait for our admin team to review and approve your application.'},
      { text: 'Once you get an approval notification, sign in to your new Host Dashboard.' },
      { text: 'First, navigate to your "Profile" to add a photo and bio, which helps build trust with guests.', image: '/host/pic2.png' },
      { text: 'Go to "My Properties" to add your first listing. Upload photos, write a description, set your price, and update your availability.', image: '/host/pic3.png' },
      { text: 'Once your property is alive, manage all incoming reservations from the "Bookings"tab.', image: '/host/pic4.png' },
      { text: 'After a guest completes their stay, track your payments and view history under "Earnings" tab.', image: '/host/pic5.png' },
      { text: 'Use the "Analytics" tab to monitor your performance, occupancy rates, and revenue to optimize your listing.', image: '/host/pic6.png' },
    ],
    tip: 'Tax cancellation and refunds.',
  },
  {
    key: 'Tour guide',
    icon: 'bi bi-compass',
    title: 'Tour guide',
    description: 'Share your passion and local knowledge. Lead unforgettable tours, connect with travelers from around the world, and earn money doing what you love.',
    steps: [
      { text: 'Begin by clicking the become a host button and selecting "TOUR GUIDE" as your role.', image: '/tour-guide/pic1.png' },
      { text: 'Complete the application with your details and expertise for our team to review.'},
      { text: 'Once your application is approved, you can sign in to your new Tour Guide Dashboard.'},
      { text: 'First, navigate to your "Profile" to upload a professional photo and write a compelling bio to attract travelers.', image: '/tour-guide/pic2.png' },
      { text: 'Track your income, pending payouts, and completed transactions. Review your commission history and request payments directly to your linked account with full transparency.', image: '/tour-guide/pic3.png' },
      { text: 'Manage all your tours in one place by creating, editing, or unlisting them. Add details like descriptions, pricing, and availability while tracking bookings and performance to grow your business.', image: '/tour-guide/pic4.png' },
      { text: 'Stay organized with a calendar view of all your upcoming tours. Block unavailable dates,adjust time slots, and sync with your personal calendar to avoid conflicts.', image: '/tour-guide/pic5.png'},
      { text: 'View feedback and ratings from guests to strengthen your reputation. Highlight positive reviews and use constructive feedback to improve your tours.', image: '/tour-guide/pic6.png'},   
    ],
    tip: 'Always keep your availability calendar and tour details up to date. A well-prepared and transparent guide earns more trust and repeat bookings.',
  },
  {
    key: 'Field agent',
    icon: 'bi bi-geo-alt',
    title: 'Field agent',
    description: 'Help clients find their perfect property, provide expert guidance, and earn competitive commissions..',
    steps: [
      { text: 'Begin by clicking the become a host button and selecting "Field Agent" as your role.', image: '/agent/pic1.png' },
      { text: 'Complete the initial application form with your professional information.',},
      { text: 'Successfully pass the "Jambolush Field Agent Assessment" to demonstrate your skills and suitability.',},
      { text: 'After passing the assessment, wait for our admin team to review and grant final approval.',},
      { text: 'Once approved, you will be notified. You can then sign in to your official Agent Dashboard.',},
      { text: 'First, navigate to your "Profile" to upload a professional photo and bio to build credibility.', image: '/agent/pic2.png' },
      { text: 'go to the “Earnings” tab to view your income and connect your bank account for commission payouts.', image: '/agent/pic3.png' },
      { text: 'Familiarize yourself with the "Clients" tab, where you will manage your client list and communications.', image: '/agent/pic4.png' },
      { text: 'Use the "Properties" section to search the network for listings that match your clients\' needs.', image: '/agent/pic5.png' },
      { text: 'Assist your clients with reservations and track their status in the "Bookings" section.', image: '/agent/pic6.png' },
      { text: 'Monitor your progress, success rate, and key metrics on your "Performance" dashboard.', image: '/agent/pic7.png' },
    ],
    tip: 'Keep your calendar updated  it boosts your visibility, builds trust with hosts and guests, and helps you earn more, faster.',
  },
];

type RoleKey = 'guest' | 'property owner' | 'Tour guide' | 'Field agent';

interface RoleCardProps {
  icon: string;
  title: string;
  description: string;
  onClick: () => void;
}

const RoleCard: React.FC<RoleCardProps> = ({ icon, title, description, onClick }) => (
  <div
    onClick={onClick}
    className="bg-white rounded-lg border border-gray-200 hover:border-[#F20C8F] cursor-pointer transition-all duration-300 p-6 hover:shadow-md group text-center"
  >
    <div className="flex flex-col items-center text-center space-y-4">
        <div className="w-14 h-14 bg-[#083A85] rounded-lg flex items-center justify-center group-hover:bg-[#F20C8F] transition-colors duration-200">
            <i className={`${icon} text-white text-xl`}></i>
        </div>
        <div className="space-y-2">
            <h3 className="text-lg font-semibold text-[#083A85] group-hover:text-[#F20C8F] transition-colors duration-200">{title}</h3>
            <p className="text-base text-gray-600 leading-relaxed">{description}</p>
        </div>
    </div>
  </div>
);

const JambolushGetStarted = () => {
  const [currentStep, setCurrentStep] = useState('role-selection');
  const [selectedRoleKey, setSelectedRoleKey] = useState<RoleKey | null>(null);

  const handleRoleSelection = (roleKey: RoleKey) => {
    setSelectedRoleKey(roleKey);
    setCurrentStep('details-view');
  };

  const handleGoBack = () => {
    setCurrentStep('role-selection');
    setSelectedRoleKey(null);
  };

  const selectedRoleData = rolesData.find(role => role.key === selectedRoleKey);

  return (
    <div className="font-sans bg-gray-50 min-h-screen py-12 mt-2">
      <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css" rel="stylesheet" />
      
      {currentStep === 'role-selection' && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center space-y-3 mb-10">
            <h1 className="mt-8 sm:mt-0 text-xl sm:text-2xl font-bold text-[#083A85]">
              Getting Started on Jambolush
            </h1>
            <p className="text-base text-gray-600 max-w-2xl mx-auto">
              Jambolush is a dynamic platform connecting users with unique living and working spaces, as well as experiences. Select a role below to see how you can get started.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {rolesData.map((role) => (
              <RoleCard
                key={role.key}
                icon={role.icon}
                title={role.title}
                description={role.description}
                onClick={() => handleRoleSelection(role.key as RoleKey)}
              />
            ))}
          </div>
        </div>
      )}

      {currentStep === 'details-view' && selectedRoleData && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8">
            <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-gray-200">
              <button
                onClick={handleGoBack}
                className="p-2 text-[#083A85] hover:bg-gray-100 rounded-md transition-colors duration-200 flex-shrink-0 cursor-pointer"
              >
                <i className="bi bi-chevron-left text-lg"></i>
              </button>
              <h2 className="text-lg sm:text-xl font-bold text-[#083A85]">
                Getting Started as a {selectedRoleData.title}
              </h2>
            </div>

            <div className="space-y-8">
                <div className="space-y-8">
                  {selectedRoleData.steps.map((step, index) => (
                    <div key={index}>
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 bg-[#083A85] text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-base mt-0.5">
                          {index + 1}
                        </div>
                        <p className="text-base text-gray-700 leading-relaxed flex-1">
                          {step.text}
                        </p>
                      </div>
                      {step.image && (
                        <div className="mt-4 pl-12">
                          <img
                            src={step.image}
                            alt={`Visual guide for step ${index + 1}`}
                            className="w-full h-auto object-cover rounded-lg border border-gray-200 shadow-sm"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg mt-8">
                <h4 className="font-semibold text-blue-800 text-base">Pro Tip:</h4>
                <p className="text-blue-700 text-base">{selectedRoleData.tip}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JambolushGetStarted;