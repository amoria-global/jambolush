"use client";
import React, { useState } from 'react';

// Define the type for form data
interface FormData {
  names: string;
  email: string;
  phone: string;
  country: string;
  state: string;
  district: string;
  sector: string;
  village: string;
  companyName: string;
  experienceLevel: string;
  propertyCategories: string[];
  services: string[];
}

// Define types for fields that accept string values vs array values
type StringFields = 'names' | 'email' | 'phone' | 'country' | 'state' | 'district' | 'sector' | 'village' | 'companyName' | 'experienceLevel';
type ArrayFields = 'propertyCategories' | 'services';

const BecomeHost = () => {
  const [currentStep, setCurrentStep] = useState('role-selection');
  const [selectedRole, setSelectedRole] = useState('');
  const [formData, setFormData] = useState<FormData>({
    names: '',
    email: '',
    phone: '',
    country: '',
    state: '',
    district: '',
    sector: '',
    village: '',
    companyName: '',
    experienceLevel: '',
    propertyCategories: [],
    services: []
  });

  const propertyCategories = [
    'Residential Houses',
    'Apartments/Condos',
    'Commercial Properties',
    'Land/Plots',
    'Vacation Rentals',
    'Industrial Properties',
    'Office Spaces',
    'Retail Spaces'
  ];

  const tourServices = [
    'City Tours',
    'Cultural Tours',
    'Nature/Wildlife Tours',
    'Historical Sites',
    'Adventure Tours',
    'Food Tours',
    'Photography Tours',
    'Custom Tours'
  ];

  const experienceLevels = [
    'Entry Level (0-1 years)',
    'Junior (1-3 years)',
    'Mid-Level (3-5 years)',
    'Senior (5-10 years)',
    'Expert (10+ years)'
  ];

  const handleInputChange = (field: StringFields, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCheckboxChange = (field: ArrayFields, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const handleRoleSelection = (role: string) => {
    setSelectedRole(role);
    setCurrentStep(`${role}-form`);
  };

  const handleFormSubmit = () => {
    if (selectedRole === 'host' || selectedRole === 'tour-guide') {
      setCurrentStep('agreement');
    } else if (selectedRole === 'field-agent') {
      setCurrentStep('questions');
    }
  };

  const goBack = () => {
    if (currentStep.includes('-form')) {
      setCurrentStep('role-selection');
      setSelectedRole('');
    } else if (currentStep === 'agreement' || currentStep === 'questions') {
      setCurrentStep(`${selectedRole}-form`);
    }
  };

  interface RoleCardProps {
    role: string;
    icon: string;
    title: string;
    description: string;
    onClick: (role: string) => void;
  }

  const RoleCard: React.FC<RoleCardProps> = ({ role, icon, title, description, onClick }) => (
    <div 
      onClick={() => onClick(role)}
      className="bg-white rounded-lg border border-gray-200 hover:border-[#F20C8F] cursor-pointer transition-all duration-200 p-6 hover:shadow-md group"
    >
      <div className="flex flex-col items-center text-center space-y-3 sm:space-y-4">
        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#083A85] rounded-lg flex items-center justify-center group-hover:bg-[#F20C8F] transition-colors duration-200">
          <i className={`${icon} text-white text-lg sm:text-xl`}></i>
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-[#083A85] group-hover:text-[#F20C8F] transition-colors duration-200">{title}</h3>
          <p className="text-base text-gray-600 leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );

  interface FormFieldProps {
    label: string;
    type?: string;
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    required?: boolean;
  }

  const FormField: React.FC<FormFieldProps> = ({ label, type = 'text', value, onChange, placeholder, required = true }) => (
    <div className="space-y-1.5">
      <label className="block text-base font-medium text-gray-700">
        {label} {required && <span className="text-[#F20C8F]">*</span>}
      </label>
      {type === 'select' ? (
        <select 
          value={value} 
          onChange={(e) => onChange(e.target.value)}
          className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-md focus:border-[#F20C8F] focus:ring-1 focus:ring-[#F20C8F] focus:outline-none transition-colors duration-200 text-base sm:text-base"
          required={required}
        >
          <option value="">{placeholder}</option>
          {experienceLevels.map(level => (
            <option key={level} value={level}>{level}</option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-md focus:border-[#F20C8F] focus:ring-1 focus:ring-[#F20C8F] focus:outline-none transition-colors duration-200 text-base sm:text-base"
          required={required}
        />
      )}
    </div>
  );

  interface CheckboxGroupProps {
    title: string;
    options: string[];
    selectedOptions: string[];
    onChange: (option: string) => void;
  }

  const CheckboxGroup: React.FC<CheckboxGroupProps> = ({ title, options, selectedOptions, onChange }) => (
    <div className="space-y-3">
      <label className="block text-base font-medium text-gray-700">
        {title} <span className="text-[#F20C8F]">*</span>
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {options.map(option => (
          <label key={option} className="flex items-center space-x-2 cursor-pointer p-2 rounded hover:bg-gray-50 transition-colors duration-200">
            <input
              type="checkbox"
              checked={selectedOptions.includes(option)}
              onChange={() => onChange(option)}
              className="w-4 h-4 text-[#F20C8F] border-gray-300 rounded focus:ring-[#F20C8F] flex-shrink-0"
            />
            <span className="text-base text-gray-700">{option}</span>
          </label>
        ))}
      </div>
    </div>
  );

  if (currentStep === 'role-selection') {
    return (
      <div className="bg-gray-50">
        <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css" rel="stylesheet" />
        
        {/* Header Section */}
        <div className="">
          <div className="max-w-4xl mx-auto px-6 py-20">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center px-3 py-1.5 bg-[#F20C8F] bg-opacity-10 text-[#F20C8F] text-base font-medium rounded-full">
                Join Our Platform
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#083A85]">Become a Host</h1>
              <p className="text-base sm:text-base text-gray-600 max-w-lg mx-auto px-4">
                Choose your role and start your journey with us. Whether you're a property owner, field agent, or tour guide.
              </p>
            </div>
          </div>
        </div>

        {/* Role Selection Cards */}
        <div className="px-4 sm:px-6 pb-12">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <RoleCard
                role="host"
                icon="bi bi-house-door"
                title="Property Owner"
                description="List your properties, connect with potential buyers or renters, and manage your real estate portfolio."
                onClick={handleRoleSelection}
              />
              <RoleCard
                role="field-agent"
                icon="bi bi-people"
                title="Field Agent"
                description="Help clients find their perfect property, provide expert guidance, and earn competitive commissions."
                onClick={handleRoleSelection}
              />
              <RoleCard
                role="tour-guide"
                icon="bi bi-geo-alt"
                title="Tour Guide"
                description="Offer unforgettable guided tours, showcase local attractions, and share your passion for travel."
                onClick={handleRoleSelection}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep.includes('-form')) {
    return (
      <div className="min-h-screen bg-gray-50 pt-10">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-3xl mx-auto px-6 py-6">
            <div className="flex items-center space-x-3">
              <button 
                onClick={goBack} 
                className="p-1.5 sm:p-2 text-[#083A85] hover:bg-gray-100 rounded-md transition-colors duration-200 flex-shrink-0"
              >
                <i className="bi bi-chevron-left text-lg"></i>
              </button>
              <div className="min-w-0">
                <h2 className="text-lg sm:text-xl font-bold text-[#083A85] truncate">
                  {selectedRole === 'host' && 'Property Owner Registration'}
                  {selectedRole === 'field-agent' && 'Field Agent Registration'}
                  {selectedRole === 'tour-guide' && 'Tour Guide Registration'}
                </h2>
                <p className="text-base text-gray-600">Please fill in your details to get started</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="max-w-3xl mx-auto px-6 py-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="space-y-6">
              {/* Personal Information Section */}
              <div className="space-y-4 sm:space-y-6">
                <h3 className="text-base sm:text-lg font-semibold text-[#083A85] pb-2 border-b border-gray-200">
                  Personal Information
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    label="Full Name"
                    value={formData.names}
                    onChange={(value) => handleInputChange('names', value)}
                    placeholder="Enter your full name"
                  />
                  <FormField
                    label="Email Address"
                    type="email"
                    value={formData.email}
                    onChange={(value) => handleInputChange('email', value)}
                    placeholder="Enter your email address"
                  />
                </div>

                <FormField
                  label="Phone Number"
                  type="tel"
                  value={formData.phone}
                  onChange={(value) => handleInputChange('phone', value)}
                  placeholder="Enter your phone number"
                />
              </div>

              {/* Location Information Section */}
              <div className="space-y-4 sm:space-y-6">
                <h3 className="text-base sm:text-lg font-semibold text-[#083A85] pb-2 border-b border-gray-200">
                  Location Information
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    label="Country"
                    value={formData.country}
                    onChange={(value) => handleInputChange('country', value)}
                    placeholder="Enter your country"
                  />
                  <FormField
                    label="State/Province"
                    value={formData.state}
                    onChange={(value) => handleInputChange('state', value)}
                    placeholder="Enter your state/province"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    label="District"
                    value={formData.district}
                    onChange={(value) => handleInputChange('district', value)}
                    placeholder="Enter your district"
                  />
                  <FormField
                    label="Sector"
                    value={formData.sector}
                    onChange={(value) => handleInputChange('sector', value)}
                    placeholder="Enter your sector"
                  />
                </div>

                <FormField
                  label="Village"
                  value={formData.village}
                  onChange={(value) => handleInputChange('village', value)}
                  placeholder="Enter your village"
                />
              </div>

              {/* Role-specific Information */}
              <div className="space-y-4 sm:space-y-6">
                <h3 className="text-base sm:text-lg font-semibold text-[#083A85] pb-2 border-b border-gray-200">
                  Professional Information
                </h3>

                {selectedRole === 'host' && (
                  <FormField
                    label="Company Name"
                    value={formData.companyName}
                    onChange={(value) => handleInputChange('companyName', value)}
                    placeholder="Enter your company name (optional)"
                    required={false}
                  />
                )}

                {selectedRole === 'field-agent' && (
                  <FormField
                    label="Experience Level"
                    type="select"
                    value={formData.experienceLevel}
                    onChange={(value) => handleInputChange('experienceLevel', value)}
                    placeholder="Select your experience level"
                  />
                )}

                {(selectedRole === 'host' || selectedRole === 'field-agent') && (
                  <CheckboxGroup
                    title="Property Categories"
                    options={propertyCategories}
                    selectedOptions={formData.propertyCategories}
                    onChange={(option) => handleCheckboxChange('propertyCategories', option)}
                  />
                )}

                {selectedRole === 'tour-guide' && (
                  <CheckboxGroup
                    title="Services Offered"
                    options={tourServices}
                    selectedOptions={formData.services}
                    onChange={(option) => handleCheckboxChange('services', option)}
                  />
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-end mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200 space-y-3 sm:space-y-0">
              <button
                onClick={handleFormSubmit}
                className="w-full sm:w-auto bg-[#F20C8F] hover:bg-[#d10b7a] text-white font-medium py-2.5 sm:py-3 px-6 sm:px-8 rounded-md transition-colors duration-200 text-base sm:text-base"
              >
                Continue Registration
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'agreement') {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
            <div className="flex items-center space-x-3">
              <button 
                onClick={goBack} 
                className="p-1.5 sm:p-2 text-[#083A85] hover:bg-gray-100 rounded-md transition-colors duration-200 flex-shrink-0"
              >
                <i className="bi bi-chevron-left text-lg"></i>
              </button>
              <div>
                <h2 className="text-xl font-bold text-[#083A85]">Terms & Agreement</h2>
                <p className="text-base text-gray-600">Please review and accept our terms of service</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-[#083A85] mb-4">Service Agreement</h3>
                <div className="space-y-3 text-gray-700 text-base leading-relaxed">
                  <p>
                    This comprehensive service agreement governs the relationship between our platform and you as a {selectedRole === 'host' ? 'property owner' : 'tour guide'}. By accepting these terms, you agree to provide quality services while adhering to our platform standards.
                  </p>
                  <p>
                    This agreement covers all aspects of your engagement with our platform, ensuring transparency and mutual benefit for all parties involved.
                  </p>
                </div>

                <div className="mt-4 sm:mt-6">
                  <h4 className="font-medium text-[#083A85] mb-3 text-base sm:text-base">Key Areas Covered:</h4>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-[#F20C8F] rounded-full"></div>
                        <span className="text-base text-gray-700">Service obligations and responsibilities</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-[#F20C8F] rounded-full"></div>
                        <span className="text-base text-gray-700">Commission structure and payment terms</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-[#F20C8F] rounded-full"></div>
                        <span className="text-base text-gray-700">Quality standards and performance metrics</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-[#F20C8F] rounded-full"></div>
                        <span className="text-base text-gray-700">Liability and insurance requirements</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-[#F20C8F] rounded-full"></div>
                        <span className="text-base text-gray-700">Termination conditions</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-[#F20C8F] rounded-full"></div>
                        <span className="text-base text-gray-700">Dispute resolution procedures</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 sm:p-4 bg-gray-50 rounded-lg">
                <input
                  type="checkbox"
                  id="agreement"
                  className="w-4 h-4 text-[#F20C8F] border-gray-300 rounded focus:ring-[#F20C8F] mt-0.5 flex-shrink-0"
                  required
                />
                <label htmlFor="agreement" className="text-base text-gray-700 leading-relaxed">
                  I have carefully read, understood, and agree to abide by all the terms and conditions outlined in this service agreement. I acknowledge that this agreement is legally binding.
                </label>
              </div>

              <div className="flex flex-col sm:flex-row sm:justify-between pt-4 sm:pt-6 border-t border-gray-200 space-y-3 sm:space-y-0 sm:space-x-4">
                <button
                  onClick={goBack}
                  className="w-full sm:w-auto bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2.5 sm:py-3 px-4 sm:px-6 rounded-md transition-colors duration-200 text-base sm:text-base"
                >
                  Go Back
                </button>
                <button
                  onClick={() => setCurrentStep('success')}
                  className="w-full sm:w-auto bg-[#F20C8F] hover:bg-[#d10b7a] text-white font-medium py-2.5 sm:py-3 px-4 sm:px-6 rounded-md transition-colors duration-200 text-base sm:text-base"
                >
                  Accept & Complete Registration
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'questions') {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
            <div className="flex items-center space-x-3">
              <button 
                onClick={goBack} 
                className="p-1.5 sm:p-2 text-[#083A85] hover:bg-gray-100 rounded-md transition-colors duration-200 flex-shrink-0"
              >
                <i className="bi bi-chevron-left text-lg"></i>
              </button>
              <div>
                <h2 className="text-xl font-bold text-[#083A85]">Field Agent Assessment</h2>
                <p className="text-base text-gray-600">Complete your knowledge assessment to proceed</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="space-y-6">
              {/* Assessment Overview */}
              <div className="bg-[#083A85] text-white p-4 sm:p-6 rounded-lg">
                <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-3 mb-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <i className="bi bi-clipboard-check text-base sm:text-lg"></i>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Assessment Overview</h3>
                    <p className="text-blue-100 text-base">Evaluate your expertise in real estate and property management</p>
                  </div>
                </div>
                <p className="text-blue-100 text-base leading-relaxed">
                  This comprehensive assessment consists of 30 carefully crafted questions designed to evaluate your knowledge, skills, and experience in real estate and property management. Your performance will help us understand your expertise level and assign appropriate opportunities.
                </p>
              </div>

              {/* Categories Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                <div className="space-y-4">
                  <h4 className="text-base sm:text-base font-semibold text-[#083A85]">Assessment Categories</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                      <span className="text-base font-medium text-gray-800">Real Estate Market Knowledge</span>
                      <span className="bg-[#F20C8F] text-white px-2 py-1 rounded-full text-base font-medium">8 questions</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                      <span className="text-base font-medium text-gray-800">Property Valuation Techniques</span>
                      <span className="bg-[#F20C8F] text-white px-2 py-1 rounded-full text-base font-medium">6 questions</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                      <span className="text-base font-medium text-gray-800">Client Relations & Communication</span>
                      <span className="bg-[#F20C8F] text-white px-2 py-1 rounded-full text-base font-medium">5 questions</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-base sm:text-base font-semibold text-[#083A85]">Additional Areas</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                      <span className="text-base font-medium text-gray-800">Legal & Regulatory Knowledge</span>
                      <span className="bg-[#F20C8F] text-white px-2 py-1 rounded-full text-base font-medium">6 questions</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                      <span className="text-base font-medium text-gray-800">Sales & Negotiation Skills</span>
                      <span className="bg-[#F20C8F] text-white px-2 py-1 rounded-full text-base font-medium">3 questions</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                      <span className="text-base font-medium text-gray-800">Technology & Tools Proficiency</span>
                      <span className="bg-[#F20C8F] text-white px-2 py-1 rounded-full text-base font-medium">2 questions</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-amber-50 border border-amber-200 p-3 sm:p-4 rounded-lg">
                <div className="flex flex-col sm:flex-row sm:items-start space-y-3 sm:space-y-0 sm:space-x-3">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center flex-shrink-0 mx-auto sm:mx-0">
                    <i className="bi bi-info-circle text-base sm:text-base"></i>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-amber-800">Assessment Instructions</h4>
                    <div className="space-y-1 text-base text-amber-700">
                      <p>• You will have <strong>45 minutes</strong> to complete all 30 questions</p>
                      <p>• Each question has multiple choice answers with one correct option</p>
                      <p>• A minimum score of <strong>70%</strong> is required to proceed with your application</p>
                      <p>• You can retake the assessment <strong>once</strong> if you don't meet the minimum score</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:justify-between pt-4 sm:pt-6 border-t border-gray-200 space-y-3 sm:space-y-0 sm:space-x-4">
                <button
                  onClick={goBack}
                  className="w-full sm:w-auto bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2.5 sm:py-3 px-4 sm:px-6 rounded-md transition-colors duration-200 text-base sm:text-base"
                >
                  Go Back
                </button>
                <button
                  onClick={() => setCurrentStep('success')}
                  className="w-full sm:w-auto bg-[#F20C8F] hover:bg-[#d10b7a] text-white font-medium py-2.5 sm:py-3 px-4 sm:px-6 rounded-md transition-colors duration-200 flex items-center justify-center space-x-2 text-base sm:text-base"
                >
                  <span>Start Assessment</span>
                  <i className="bi bi-arrow-right"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="max-w-lg mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <div className="space-y-6">
              {/* Success Icon */}
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mx-auto">
                <i className="bi bi-check-circle text-xl sm:text-2xl"></i>
              </div>

              {/* Success Message */}
              <div className="space-y-2 sm:space-y-3">
                <h2 className="text-xl sm:text-2xl font-bold text-[#083A85]">Registration Complete!</h2>
                <p className="text-base sm:text-base text-gray-600 leading-relaxed px-2">
                  Congratulations! Your application has been submitted successfully and is now under review by our team.
                </p>
              </div>

              {/* Next Steps */}
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5">
                    <i className="bi bi-clock text-base"></i>
                  </div>
                  <div className="text-left">
                    <h4 className="font-medium text-blue-900 mb-1">What Happens Next?</h4>
                    <p className="text-blue-700 text-base leading-relaxed">
                      You will receive a confirmation email within 24 hours with detailed next steps and account activation instructions. Our team will review your application and contact you shortly.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => {
                  setCurrentStep('role-selection');
                  setSelectedRole('');
                  setFormData({
                    names: '',
                    email: '',
                    phone: '',
                    country: '',
                    state: '',
                    district: '',
                    sector: '',
                    village: '',
                    companyName: '',
                    experienceLevel: '',
                    propertyCategories: [],
                    services: []
                  });
                }}
                className="w-full sm:w-auto bg-[#F20C8F] hover:bg-[#d10b7a] text-white font-medium py-2.5 sm:py-3 px-6 sm:px-8 rounded-md transition-colors duration-200 text-base sm:text-base"
              >
                Go To Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
export default BecomeHost;