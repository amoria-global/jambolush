"use client";
import React, { useState } from 'react';

const rolesData = [
  {
    key: 'guest',
    icon: 'bi bi-person',
    title: 'Guests',
    description: 'Explore unique homes, tours, and experiences. Book your stay, manage your trips, and travel with ease.',
    steps: [
    'Start by creating your account on the Jambolush website or mobile app.',
    'After signing in, navigate to "Profile" to add a photo and your personal information.',
    'Go to the "Payments" section to securely add your preferred payment method for easy booking.',
    'Visit "Settings" to configure your notification preferences and other account details.',
    'From the Home page, use the main search bar by selecting Stay for "accommodations" or "Spot" for points of interest. Enter a location and keywords to find what you are looking for. For guided activities, click the "Find a Tour" button in the top menu.', 
    'When you find something you love, save it to your "Wishlist" to compare your favorite options.',
    'Once you are ready, select your dates and complete your reservation.',
    'After booking, find all your trip details and manage your stay under "My Bookings".',
    'Use the "Schedule" tab to see a convenient calendar view of all your upcoming trips.',
    'If you ever need help, the "Help & Support" section is available to assist you.',
    ],
    tip: 'Unlock travel rewards! Invite friends to Jambolush to earn credits to  use Gift Cards to make booking even easier.',
  },
  {
    key: 'Host',
    icon: 'bi bi-briefcase',
    title: 'Property Owner',
    description: 'List your properties, connect with potential buyers or renters, and manage your real estate portfolio',
    steps: [
    'Click the "Become a Host" button to begin your registration.',
    'Select "Property Owner" as your account type.',
    'Complete the application form with your required details.',
    'Submit the application and set a secure password for your account.',
    'Wait for our admin team to review and approve your application.',
    'Once you get an approval notification, sign in to your new Host Dashboard.',
    'First, navigate to your "Profile" to add a photo and bio, which helps build trust with guests.',
    'Next, go to "Settings" to connect your bank account or preferred payout method so you can get paid.',
    'Go to "My Properties" to add your first listing. Upload photos, write a description, set your price, and update your availability.',
    'Once your property is live, manage all incoming reservations from the "Bookings" section.',
    'After a guest completes their stay, track your payments and view history under "Earnings".',
    'Use the "Analytics" tab to monitor your performance, occupancy rates, and revenue to optimize your listing.',        
    ],
    tip: 'Tax cancellation and refunds.',
  },
  {
    key: 'TOUR GUIDE',
    icon: 'bi bi-compass',
    title: 'TOUR GUIDE',
    description: 'Share your passion and local knowledge. Lead unforgettable tours, connect with travelers from around the world, and earn money doing what you love.',
    steps: [
    'Begin by clicking the become a host button and selecting "TOUR GUIDE" as your role.',
    'Complete the application with your details and expertise for our team to review.',
    'Once your application is approved, you can sign in to your new Tour Guide Dashboard.',
    'First, navigate to your "Profile" to upload a professional photo and write a compelling bio to attract travelers.',
    'Next, visit "Settings" to configure your account preferences and connect your bank account for payouts.',
    'Go to "My Tours" to create your first tour. Add a captivating title, photos, a detailed itinerary, and set your price.',
    'Use the "Schedule" tab to set your availability and manage the calendar for your tours.',
    'Once you start receiving bookings, track your payments and transaction history in the "Earnings" section.',
    'After leading a tour, check the "Reviews" tab to read valuable feedback from your guests.',
    'Use guest reviews to refine your tours and build a 5-star reputation on Jambolush.',

    ],
    tip: 'Regularly check your Tour Dashboard for updates and feedback from clients.',
  },
  {
    key: 'FIELD AGENT',
    icon: 'bi bi-geo-alt',
    title: 'FIELD AGENT',
    description: 'Help clients find their perfect property, provide expert guidance, and earn competitive commissions..',
    steps: [
    'Begin by clicking the become a host button and selecting "Field Agent" as your role.',
    'Complete the initial application form with your professional information.',
    'Successfully pass the "Jambolush Field Agent Assessment" to demonstrate your skills and suitability.',
    'After passing the assessment, wait for our admin team to review and grant final approval.',
    'Once approved, you will be notified. You can then sign in to your official Agent Dashboard.',
    'First, navigate to your "Profile" to upload a professional photo and bio to build credibility.',
    'Go to the "Earnings" or "Settings" section to connect your bank account for commission payouts.',
    'Familiarize yourself with the "Clients" tab, where you will manage your client list and communications.',
    'Use the "Properties" section to search the network for listings that match your clients\' needs.',
    'Assist your clients with reservations and track their status in the "Bookings" section.',
    'Monitor your progress, success rate, and key metrics on your "Performance" dashboard.',
    ],
    tip: 'Keep your availability calendar updated to ensure smooth guest experiences.',
  },
];

type RoleKey = 'guest' | 'agent' | 'tour' | 'FIELD AGENT';

interface RoleCardProps {
  icon: string;
  title: string;
  description: string;
  onClick: () => void;
}

// Card component for the initial role selection screen
const RoleCard: React.FC<RoleCardProps> = ({ icon, title, description, onClick }) => (
  <div 
    onClick={onClick}
    className="bg-white rounded-lg border border-gray-200 hover:border-[#F20C8F] cursor-pointer transition-all duration-300 p-6 hover:shadow-xl group h-full flex flex-col text-center"
  >
    <div className="mx-auto mb-4 w-16 h-16 bg-[#083A85] rounded-lg flex items-center justify-center group-hover:bg-[#F20C8F] transition-colors duration-200 flex-shrink-0">
      <i className={`${icon} text-white text-2xl`}></i>
    </div>
    <h3 className="text-xl font-bold text-[#083A85] group-hover:text-[#F20C8F] transition-colors duration-200 mb-2">{title}</h3>
    <p className="text-base text-gray-600 leading-relaxed">{description}</p>
  </div>
);

// The main component for the "Getting Started" page
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
    <div className="bg-gray-50 min-h-screen">
      <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css" rel="stylesheet" />

      {currentStep === 'role-selection' && (
        <>
          <div className="pt-20 pb-12">
            <div className="max-w-4xl mx-auto px-6 text-center space-y-4">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#083A85]">
                Getting Started on Jambolush
              </h1>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Jambolush is a dynamic platform connecting users with unique living and working spaces, as well as experiences. Select a role below to see how you can get started.
              </p>
            </div>
          </div>

          <div className="px-4 sm:px-6 pb-20">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
          </div>
        </>
      )}
      
      {currentStep === 'details-view' && selectedRoleData && (
        <div className="py-16">
          <div className="max-w-3xl mx-auto px-6">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
              <div className="flex items-center space-x-4 mb-6">
                <button 
                  onClick={handleGoBack} 
                  className="p-2 text-[#083A85] hover:bg-gray-100 rounded-full transition-colors duration-200"
                >
                  <i className="bi bi-arrow-left text-xl"></i>
                </button>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#083A85]">
                  Getting Started as a {selectedRoleData.title}
                </h2>
              </div>
              
              <div className="space-y-6">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Steps to Get Started:</h3>
                    <ul className="space-y-3 list-disc list-inside text-gray-700">
                        {selectedRoleData.steps.map((step, index) => (
                            <li key={index}>{step}</li>
                        ))}
                    </ul>
                </div>
                
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                    <h4 className="font-bold text-blue-800">Tip:</h4>
                    <p className="text-blue-700">{selectedRoleData.tip}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JambolushGetStarted;