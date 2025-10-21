"use client";
import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/app/api/api-conn';
import AlertNotification from '@/app/components/notify';
import { documentUploadService } from '@/app/utils/storage';

// Define the type for form data
interface FormData {
  role: 'host' | 'tourguide' | 'agent' | '';
  names: string;
  email: string;
  phone: string;
  country: string;
  state: string;
  city: string;
  street: string;
  province: string;
  address?: string;
  password: string;
  confirmPassword: string;
  experienceLevel?: string;
  propertyTypes?: string[];
  services?: string[];
  tourGuideType?: 'freelancer' | 'company' | '';
  nationalId?: string;
  companyRegistration?: string;
  companyName?: string;
  verificationDocument?: File | null;
}

interface ServiceProviderApplicationRequest {
  names: string;
  email: string;
  phone: string;
  password: string;
  country: string;
  state?: string;
  province?: string;
  city?: string;
  street?: string;
  experienceLevel?: string;
  propertyCategories?: string[];
  services?: string[];
  userType: 'host' | 'tourguide' | 'agent';
  tourGuideType?: 'freelancer' | 'company' | any;
  nationalId?: string;
  companyRegistration?: string;
  companyName?: string;
  verificationDocument?: string;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefilledData?: {
    names?: string;
    email?: string;
    phone?: string;
    country?: string;
    password?: string;
  };
}

const BecomeHostModal: React.FC<ModalProps> = ({ isOpen, onClose, prefilledData }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    role: '',
    names: prefilledData?.names || '',
    email: prefilledData?.email || '',
    phone: prefilledData?.phone || '',
    country: prefilledData?.country || '',
    state: '',
    province: '',
    city: '',
    street: '',
    password: prefilledData?.password || '',
    confirmPassword: prefilledData?.password || '',
    experienceLevel: '',
    propertyTypes: [],
    services: [],
    tourGuideType: '',
    nationalId: '',
    companyRegistration: '',
    companyName: '',
    verificationDocument: null
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [applicationId, setApplicationId] = useState<string>('');
  const [notify, setNotify] = useState<{type: "success" | "error" | "info" | "warning", message: string} | null>(null);
  const [direction, setDirection] = useState(0); // 1 for forward, -1 for backward

  const totalSteps = 7;

  // Update form data when prefilled data changes
  useEffect(() => {
    if (prefilledData && isOpen) {
      setFormData(prev => ({
        ...prev,
        names: prefilledData.names || prev.names,
        email: prefilledData.email || prev.email,
        phone: prefilledData.phone || prev.phone,
        country: prefilledData.country || prev.country,
        password: prefilledData.password || prev.password,
        confirmPassword: prefilledData.password || prev.confirmPassword,
      }));
    }
  }, [prefilledData, isOpen]);

  // Check if all required fields for a step are complete
  const areRequiredFieldsComplete = (step: number): boolean => {
    switch (step) {
      case 1:
        return formData.role !== '';
      case 2:
        return formData.names.trim() !== '' && 
               formData.email.trim() !== '' && 
               formData.phone.trim() !== '';
      case 3:
        // Country, state, province, city, and street are required
        return formData.country.trim() !== '' &&
               formData.state.trim() !== '' &&
               formData.province.trim() !== '' &&
               formData.city.trim() !== '' &&
               formData.street.trim() !== '';
      case 4:
        if (formData.role === 'host') {
          return !!(formData.propertyTypes && formData.propertyTypes.length > 0);
        }
        if (formData.role === 'agent') {
          return !!formData.experienceLevel &&
                 !!(formData.propertyTypes && formData.propertyTypes.length > 0);
        }
        if (formData.role === 'tourguide') {
          if (!formData.services || formData.services.length === 0) return false;
          if (!formData.tourGuideType) return false;
          if (!formData.verificationDocument) return false;
          if (formData.tourGuideType === 'freelancer' && !formData.nationalId?.trim()) return false;
          if (formData.tourGuideType === 'company') {
            if (!formData.companyRegistration?.trim() || !formData.companyName?.trim()) return false;
          }
          return true;
        }
        return false;
      case 5:
        return formData.password.trim() !== '' &&
               formData.confirmPassword.trim() !== '' &&
               formData.password === formData.confirmPassword &&
               formData.password.length >= 8;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setDirection(1);
      if (currentStep === 6) {
        handleSubmit();
      } else {
        setCurrentStep(prev => prev + 1);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setDirection(-1);
      setCurrentStep(prev => prev - 1);
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!formData.role) newErrors.role = 'Please select a role';
        break;
      case 2:
        if (!formData.names.trim()) newErrors.names = 'Name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
        break;
      case 3:
        if (!formData.country.trim()) newErrors.country = 'Country is required';
        if (!formData.state.trim()) newErrors.state = 'State is required';
        if (!formData.province.trim()) newErrors.province = 'Province is required';
        if (!formData.city.trim()) newErrors.city = 'City is required';
        if (!formData.street.trim()) newErrors.street = 'Street address is required';
        break;
      case 4:
        if (formData.role === 'host' && (!formData.propertyTypes || formData.propertyTypes.length === 0)) {
          newErrors.propertyTypes = 'Please select at least one property type';
        }
        if (formData.role === 'agent') {
          if (!formData.experienceLevel) {
            newErrors.experienceLevel = 'Please select your experience level';
          }
          if (!formData.propertyTypes || formData.propertyTypes.length === 0) {
            newErrors.propertyTypes = 'Please select at least one property type';
          }
        }
        if (formData.role === 'tourguide') {
          if (!formData.services || formData.services.length === 0) {
            newErrors.services = 'Please select at least one service';
          }
          if (!formData.verificationDocument) {
            newErrors.document = 'Verification document is required';
          }
        }
        break;
      case 5:
        if (!formData.password.trim()) {
          newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
          newErrors.password = 'Password must be at least 8 characters';
        }
        if (!formData.confirmPassword.trim()) {
          newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = 'Passwords do not match';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      setNotify({ type: 'warning', message: 'Please fill in all required fields correctly.' });
      return;
    }

    setIsLoading(true);
    try {
      let documentUrl = '';

      if (formData.verificationDocument && formData.role === 'tourguide') {
        setIsUploading(true);
        
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => {
            if (prev >= 90) {
              clearInterval(progressInterval);
              return prev;
            }
            return prev + 10;
          });
        }, 100);

        try {
          const tempUserId = `user_${Date.now()}`;
          const documentType: 'national_id' | 'company_tin' = 
            formData.tourGuideType === 'freelancer' ? 'national_id' : 'company_tin';

          documentUrl = await documentUploadService.uploadVerificationDocument(
            formData.verificationDocument,
            tempUserId,
            documentType
          );

          clearInterval(progressInterval);
          setUploadProgress(100);
        } catch (uploadError: any) {
          clearInterval(progressInterval);
          console.error('Upload error:', uploadError);
          setNotify({ 
            type: 'error', 
            message: 'Failed to upload document. Please try again.' 
          });
          setIsLoading(false);
          setIsUploading(false);
          setUploadProgress(0);
          return;
        }
      }

      const requestData: ServiceProviderApplicationRequest = {
        names: formData.names,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        country: formData.country,
        state: formData.state,
        province: formData.province,
        city: formData.city,
        street: formData.address,
        experienceLevel: formData.experienceLevel,
        propertyCategories: formData.propertyTypes || [],
        services: formData.services || [],
        userType: formData.role as 'host' | 'tourguide' | 'agent',
      };

      if (formData.role === 'tourguide') {
        requestData.tourGuideType = formData.tourGuideType;
        requestData.verificationDocument = documentUrl;
        
        if (formData.tourGuideType === 'freelancer') {
          requestData.nationalId = formData.nationalId;
        } else if (formData.tourGuideType === 'company') {
          requestData.companyRegistration = formData.companyRegistration;
          requestData.companyName = formData.companyName;
        }
      }

      const response: any = await api.post('/auth/register', requestData);

      // Check if response is successful (status 201 means created)
      if (response.success && response.data) {
        // Store tokens in localStorage
        if (response.data.accessToken) {
          localStorage.setItem('authToken', response.data.accessToken);
        }
        if (response.data.refreshToken) {
          localStorage.setItem('refreshToken', response.data.refreshToken);
        }

        setApplicationId(response.data.applicationId || '');
        setNotify({
          type: 'success',
          message: 'Application submitted successfully! Redirecting...'
        });

        setTimeout(() => {
          setCurrentStep(7);
        }, 1500);
      } else {
        throw new Error('Application submission failed');
      }

    } catch (error: any) {
      console.error('Submission error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to submit application. Please try again.';
      setNotify({ 
        type: 'error', 
        message: errorMessage 
      });
    } finally {
      setIsLoading(false);
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.names.trim()) errors.names = 'Full name is required';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) errors.email = 'Email is required';
    else if (!emailRegex.test(formData.email)) errors.email = 'Invalid email address';

    if (!formData.phone.trim()) errors.phone = 'Phone number is required';
    if (!formData.country.trim()) errors.country = 'Country is required';
    if (!formData.state.trim()) errors.state = 'State is required';
    if (!formData.province.trim()) errors.province = 'Province is required';
    if (!formData.city.trim()) errors.city = 'City is required';
    if (!formData.street.trim()) errors.street = 'Street address is required';

    // Password validation
    if (!formData.password.trim()) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }
    if (!formData.confirmPassword.trim()) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (formData.role === 'agent' && !formData.experienceLevel) {
      errors.experienceLevel = 'Experience level is required';
    }

    if ((formData.role === 'host' || formData.role === 'agent') && (!formData.propertyTypes || formData.propertyTypes.length === 0)) {
      errors.propertyCategories = 'Please select at least one property category';
    }

    if (formData.role === 'tourguide') {
      if (!formData.services || formData.services.length === 0) {
        errors.services = 'Please select at least one service';
      }

      if (!formData.tourGuideType) {
        errors.tourGuideType = 'Please select tour guide type';
      }

      if (formData.tourGuideType === 'freelancer') {
        if (!formData.nationalId?.trim()) errors.nationalId = 'National ID is required';
        if (!formData.verificationDocument) errors.verificationDocument = 'Verification document is required';
      }

      if (formData.tourGuideType === 'company') {
        if (!formData.companyRegistration?.trim()) errors.companyRegistration = 'Company registration is required';
        if (!formData.companyName?.trim()) errors.companyName = 'Company name is required';
        if (!formData.verificationDocument) errors.verificationDocument = 'Verification document is required';
      }
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const renderProgressBar = () => (
    <div className="mb-8">
      <div className="flex justify-between mb-2">
        {[...Array(totalSteps)].map((_, index) => (
          <div
            key={index}
            className={`h-1 flex-1 mx-1 rounded-full transition-all duration-300 ${
              index < currentStep ? 'bg-[#083A85]' : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
    </div>
  );

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <RoleSelection formData={formData} setFormData={setFormData} errors={errors} />;
      case 2:
        return <PersonalDetails formData={formData} setFormData={setFormData} errors={errors} />;
      case 3:
        return <LocationDetails formData={formData} setFormData={setFormData} errors={errors} />;
      case 4:
        return <ProfessionalDetails formData={formData} setFormData={setFormData} errors={errors} isUploading={isUploading} uploadProgress={uploadProgress} />;
      case 5:
        return <PasswordStep formData={formData} setFormData={setFormData} errors={errors} />;
      case 6:
        return <ReviewSubmit formData={formData} />;
      case 7:
        return <SuccessStep role={formData.role} applicationId={applicationId} />;
      default:
        return null;
    }
  };

  // Animation variants for smooth sliding
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  if (!isOpen) return null;

  return (
    <>
      {notify && (
        <AlertNotification 
          type={notify.type} 
          message={notify.message} 
          onClose={() => setNotify(null)}
        />
      )}
      
      {isOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-xl animate-slideUp">
            <div className="flex items-center justify-between p-6 border-b">
              <button
                onClick={currentStep > 1 ? handleBack : onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                disabled={isLoading || isUploading}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h2 className="text-lg font-semibold">Become a Service Provider</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                disabled={isLoading || isUploading}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)] scroll-smooth">
              {renderProgressBar()}
              <div className="relative overflow-hidden">
                <AnimatePresence initial={false} custom={direction} mode="wait">
                  <motion.div
                    key={currentStep}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      x: { type: "spring", stiffness: 300, damping: 30 },
                      opacity: { duration: 0.2 }
                    }}
                  >
                    {renderStep()}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            <div className="flex items-center justify-between p-6 border-t bg-gray-50">
              {currentStep !== 7 ? (
                <>
                  <button
                    onClick={currentStep > 1 ? handleBack : onClose}
                    className="text-gray-600 font-medium hover:text-gray-800 transition-colors"
                    disabled={isLoading || isUploading}
                  >
                    {currentStep > 1 ? 'Back' : 'Cancel'}
                  </button>
                  {currentStep < 6 ? (
                    <button
                      onClick={handleNext}
                      className="bg-[#083A85] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#062d6b] transition-colors disabled:opacity-50"
                      disabled={isLoading || isUploading || !areRequiredFieldsComplete(currentStep)}
                    >
                      Continue
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmit}
                      disabled={isLoading || isUploading}
                      className="bg-[#083A85] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#062d6b] transition-colors disabled:opacity-50"
                    >
                      {isUploading ? `Uploading... ${uploadProgress}%` : isLoading ? 'Submitting...' : 'Submit Application'}
                    </button>
                  )}
                </>
              ) : (
                <div className="w-full">
                  <button
                    onClick={() => {
                      const url = `/all/account-verification?application=true&type=${formData.role}`;
                      window.location.href = url;
                    }}
                    className="w-full bg-[#083A85] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#062d6b] transition-colors"
                  >
                    Verify Account
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Step Components
const RoleSelection: React.FC<{
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  errors: Record<string, string>;
}> = ({ formData, setFormData, errors }) => {
  const roles = [
    {
      id: 'host',
      title: 'Property Host',
      description: 'List and manage properties for rent',
      icon: '🏠'
    },
    {
      id: 'tourguide',
      title: 'Tour Guide',
      description: 'Offer guided tours and experiences',
      icon: '🗺️'
    },
    {
      id: 'agent',
      title: 'Field Agent',
      description: 'Help others find and book properties',
      icon: '🤝'
    }
  ];

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-semibold mb-2">Choose your role</h3>
        <p className="text-gray-600">Select how you want to contribute to our platform</p>
      </div>
      {errors.role && (
        <div className="text-red-500 text-sm text-center">{errors.role}</div>
      )}
      <div className="grid gap-4">
        {roles.map((role) => (
          <button
            key={role.id}
            onClick={() => setFormData(prev => ({ ...prev, role: role.id as any }))}
            className={`p-6 rounded-xl border-2 text-left transition-all ${
              formData.role === role.id
                ? 'border-[#083A85] bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-start space-x-4">
              <span className="text-3xl">{role.icon}</span>
              <div className="flex-1">
                <h4 className="text-lg font-semibold mb-1">{role.title}</h4>
                <p className="text-gray-600">{role.description}</p>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                formData.role === role.id ? 'border-[#083A85]' : 'border-gray-300'
              }`}>
                {formData.role === role.id && (
                  <div className="w-3 h-3 rounded-full bg-[#083A85]" />
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

const PersonalDetails: React.FC<{
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  errors: Record<string, string>;
}> = ({ formData, setFormData, errors }) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-semibold mb-2">Personal Information</h3>
        <p className="text-gray-600">Tell us about yourself</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Full Name *</label>
          <input
            type="text"
            value={formData.names}
            onChange={(e) => setFormData(prev => ({ ...prev, names: e.target.value }))}
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#083A85] focus:border-transparent ${
              errors.names ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter your full name"
          />
          {errors.names && <p className="text-red-500 text-sm mt-1">{errors.names}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Email Address *</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#083A85] focus:border-transparent ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="your@email.com"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Phone Number *</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#083A85] focus:border-transparent ${
              errors.phone ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="+1 234 567 890"
          />
          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
        </div>
      </div>
    </div>
  );
};

const LocationDetails: React.FC<{
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  errors: Record<string, string>;
}> = ({ formData, setFormData, errors }) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-semibold mb-2">Where are you located?</h3>
        <p className="text-gray-600">This helps us connect you with local opportunities</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Country *</label>
          <input
            type="text"
            value={formData.country}
            onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#083A85] focus:border-transparent transition-all duration-300 ${
              errors.country ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Select your country"
          />
          {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">State *</label>
            <input
              type="text"
              value={formData.state}
              onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#083A85] focus:border-transparent transition-all duration-300 ${
                errors.state ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="State"
            />
            {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Province *</label>
            <input
              type="text"
              value={formData.province}
              onChange={(e) => setFormData(prev => ({ ...prev, province: e.target.value }))}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#083A85] focus:border-transparent transition-all duration-300 ${
                errors.province ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Province"
            />
            {errors.province && <p className="text-red-500 text-sm mt-1">{errors.province}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">City *</label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#083A85] focus:border-transparent transition-all duration-300 ${
                errors.city ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your city"
            />
            {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Street Address *</label>
            <input
              type="text"
              value={formData.street}
              onChange={(e) => setFormData(prev => ({ ...prev, street: e.target.value }))}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#083A85] focus:border-transparent transition-all duration-300 ${
                errors.street ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="123 Main Street"
            />
            {errors.street && <p className="text-red-500 text-sm mt-1">{errors.street}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfessionalDetails: React.FC<{
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  errors: Record<string, string>;
  isUploading?: boolean;
  uploadProgress?: number;
}> = ({ formData, setFormData, errors, isUploading = false, uploadProgress = 0 }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      const validation = documentUploadService.validateDocument(file);
      if (validation.valid) {
        setFormData(prev => ({ ...prev, verificationDocument: file }));
      } else {
        alert(validation.error);
        e.target.value = '';
      }
    }
  };

  const propertyTypes = ['Apartment', 'House', 'Villa', 'Condo', 'Townhouse', 'Loft'];
  const tourServices = ['City Tours', 'Cultural Tours', 'Adventure Tours', 'Food Tours', 'Nature Tours', 'Historical Tours'];

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-semibold mb-2">
          {formData.role === 'host' ? 'Property Information' : formData.role === 'agent' ? 'Experience & Expertise' : 'Verification Documents'}
        </h3>
        <p className="text-gray-600">
          {formData.role === 'host' ? 'Tell us about the properties you manage' : formData.role === 'agent' ? 'Share your experience level' : 'Upload documents to verify your identity'}
        </p>
      </div>

      <div className="space-y-4">
        {formData.role === 'host' && (
          <div>
            <label className="block text-sm font-medium mb-2">Property Types You Manage *</label>
            <div className="grid grid-cols-2 gap-3">
              {propertyTypes.map((type) => (
                <label key={type} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.propertyTypes?.includes(type) || false}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData(prev => ({ 
                          ...prev, 
                          propertyTypes: [...(prev.propertyTypes || []), type] 
                        }));
                      } else {
                        setFormData(prev => ({ 
                          ...prev, 
                          propertyTypes: (prev.propertyTypes || []).filter(t => t !== type) 
                        }));
                      }
                    }}
                    className="w-4 h-4 text-[#083A85] border-gray-300 rounded focus:ring-[#083A85]"
                  />
                  <span className="text-sm">{type}</span>
                </label>
              ))}
            </div>
            {errors.propertyTypes && <p className="text-red-500 text-sm mt-1">{errors.propertyTypes}</p>}
          </div>
        )}

        {formData.role === 'agent' && (
          <div>
            <label className="block text-sm font-medium mb-2">Experience Level *</label>
            <select
              value={formData.experienceLevel || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, experienceLevel: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#083A85] focus:border-transparent"
            >
              <option value="">Select your experience level</option>
              <option value="beginner">Beginner (Less than 1 year)</option>
              <option value="intermediate">Intermediate (1-3 years)</option>
              <option value="experienced">Experienced (3-5 years)</option>
              <option value="expert">Expert (5+ years)</option>
            </select>
            {errors.experienceLevel && <p className="text-red-500 text-sm mt-1">{errors.experienceLevel}</p>}

            <div className="mt-4">
              <label className="block text-sm font-medium mb-2">Property Types You Specialize In *</label>
              <div className="grid grid-cols-2 gap-3">
                {propertyTypes.map((type) => (
                  <label key={type} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.propertyTypes?.includes(type) || false}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData(prev => ({ 
                            ...prev, 
                            propertyTypes: [...(prev.propertyTypes || []), type] 
                          }));
                        } else {
                          setFormData(prev => ({ 
                            ...prev, 
                            propertyTypes: (prev.propertyTypes || []).filter(t => t !== type) 
                          }));
                        }
                      }}
                      className="w-4 h-4 text-[#083A85] border-gray-300 rounded focus:ring-[#083A85]"
                    />
                    <span className="text-sm">{type}</span>
                  </label>
                ))}
              </div>
              {errors.propertyTypes && <p className="text-red-500 text-sm mt-1">{errors.propertyTypes}</p>}
            </div>
          </div>
        )}

        {formData.role === 'tourguide' && (
          <>
            <div>
              <label className="block text-sm font-medium mb-2">Services You Offer *</label>
              <div className="grid grid-cols-2 gap-3">
                {tourServices.map((service) => (
                  <label key={service} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.services?.includes(service) || false}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData(prev => ({ 
                            ...prev, 
                            services: [...(prev.services || []), service] 
                          }));
                        } else {
                          setFormData(prev => ({ 
                            ...prev, 
                            services: (prev.services || []).filter(s => s !== service) 
                          }));
                        }
                      }}
                      className="w-4 h-4 text-[#083A85] border-gray-300 rounded focus:ring-[#083A85]"
                    />
                    <span className="text-sm">{service}</span>
                  </label>
                ))}
              </div>
              {errors.services && <p className="text-red-500 text-sm mt-1">{errors.services}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Tour Guide Type *</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setFormData(prev => ({ ...prev, tourGuideType: 'freelancer' }))}
                  className={`p-4 rounded-lg border-2 ${
                    formData.tourGuideType === 'freelancer'
                      ? 'border-[#083A85] bg-blue-50'
                      : 'border-gray-200'
                  }`}
                >
                  <div className="text-left">
                    <h4 className="font-medium">Freelancer</h4>
                    <p className="text-sm text-gray-600">Independent tour guide</p>
                  </div>
                </button>
                <button
                  onClick={() => setFormData(prev => ({ ...prev, tourGuideType: 'company' }))}
                  className={`p-4 rounded-lg border-2 ${
                    formData.tourGuideType === 'company'
                      ? 'border-[#083A85] bg-blue-50'
                      : 'border-gray-200'
                  }`}
                >
                  <div className="text-left">
                    <h4 className="font-medium">Company</h4>
                    <p className="text-sm text-gray-600">Tour company representative</p>
                  </div>
                </button>
              </div>
            </div>

            {formData.tourGuideType === 'freelancer' && (
              <div>
                <label className="block text-sm font-medium mb-2">National ID Number *</label>
                <input
                  type="text"
                  value={formData.nationalId || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, nationalId: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#083A85] focus:border-transparent"
                  placeholder="Enter your ID number"
                />
              </div>
            )}

            {formData.tourGuideType === 'company' && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-2">Company Registration *</label>
                  <input
                    type="text"
                    value={formData.companyRegistration || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, companyRegistration: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#083A85] focus:border-transparent"
                    placeholder="Enter registration number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Company Name *</label>
                  <input
                    type="text"
                    value={formData.companyName || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#083A85] focus:border-transparent"
                    placeholder="Enter company name"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">
                Upload Verification Document *
              </label>
              <div className={`border-2 border-dashed rounded-lg p-8 text-center ${
                errors.document ? 'border-red-500' : 'border-gray-300'
              }`}>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  id="document-upload"
                  accept=".jpg,.jpeg,.png,.pdf"
                  disabled={isUploading}
                />
                <label htmlFor="document-upload" className="cursor-pointer">
                  <div className="space-y-2">
                    {isUploading ? (
                      <div className="space-y-3">
                        <svg className="mx-auto h-12 w-12 text-gray-400 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p className="text-sm text-gray-600">
                          Uploading... {uploadProgress}%
                        </p>
                        <div className="w-full bg-gray-200 rounded-full h-2 max-w-xs mx-auto">
                          <div className="bg-[#083A85] h-2 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                        </div>
                      </div>
                    ) : (
                      <>
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        {formData.verificationDocument ? (
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">{formData.verificationDocument.name}</span><br/>
                            <span className="text-xs">Click to change file</span>
                          </p>
                        ) : (
                          <p className="text-sm text-gray-600">
                            Click to upload or drag and drop<br />
                            PDF, JPG, PNG up to 5MB
                          </p>
                        )}
                      </>
                    )}
                  </div>
                </label>
              </div>
              {errors.document && <p className="text-red-500 text-sm mt-1">{errors.document}</p>}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const PasswordStep: React.FC<{
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  errors: Record<string, string>;
}> = ({ formData, setFormData, errors }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-semibold mb-2">Secure Your Account</h3>
        <p className="text-gray-600">Create a strong password to protect your account</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Password *</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#083A85] focus:border-transparent ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          <p className="text-xs text-gray-500 mt-1">Password must be at least 8 characters long</p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Confirm Password *</label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#083A85] focus:border-transparent ${
                errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Confirm your password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showConfirmPassword ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
          {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
        </div>

        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-start space-x-3">
            <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div className="flex-1">
              <p className="text-sm text-blue-800">
                <strong>Password Tips:</strong> Use a mix of letters, numbers, and symbols for a stronger password.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ReviewSubmit: React.FC<{ formData: FormData }> = ({ formData }) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-semibold mb-2">Review your application</h3>
        <p className="text-gray-600">Make sure everything looks correct</p>
      </div>
      
      <div className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">Role</h4>
          <p className="text-gray-600 capitalize">{formData.role}</p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">Personal Information</h4>
          <div className="space-y-1 text-gray-600">
            <p>{formData.names}</p>
            <p>{formData.email}</p>
            <p>{formData.phone}</p>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">Location</h4>
          <div className="space-y-1 text-gray-600">
            <p>{formData.city && `${formData.city}, `}{formData.country}</p>
            {formData.street && <p>{formData.street}</p>}
          </div>
        </div>

        {formData.propertyTypes && formData.propertyTypes.length > 0 && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Property Types</h4>
            <div className="flex flex-wrap gap-2">
              {formData.propertyTypes.map((type) => (
                <span key={type} className="px-3 py-1 bg-white border border-gray-300 rounded-full text-sm">
                  {type}
                </span>
              ))}
            </div>
          </div>
        )}

        {formData.services && formData.services.length > 0 && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Services Offered</h4>
            <div className="flex flex-wrap gap-2">
              {formData.services.map((service) => (
                <span key={service} className="px-3 py-1 bg-white border border-gray-300 rounded-full text-sm">
                  {service}
                </span>
              ))}
            </div>
          </div>
        )}

        {formData.tourGuideType && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Tour Guide Details</h4>
            <p className="text-gray-600 capitalize">{formData.tourGuideType}</p>
            {formData.verificationDocument && (
              <p className="text-sm text-gray-500 mt-1">
                Document: {formData.verificationDocument.name}
              </p>
            )}
          </div>
        )}

        {formData.experienceLevel && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Experience Level</h4>
            <p className="text-gray-600 capitalize">{formData.experienceLevel}</p>
          </div>
        )}

        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-start space-x-3">
            <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div className="flex-1">
              <p className="text-sm text-blue-800">
                By submitting this application, you agree to our terms of service and privacy policy.
                Your application will be reviewed within 24-48 hours.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SuccessStep: React.FC<{ role: string; applicationId: string }> = ({ role, applicationId }) => {
  return (
    <div className="space-y-6 text-center">
      <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      </div>
      
      <div className="space-y-2">
        <h3 className="text-2xl font-semibold text-gray-900">Application Submitted Successfully!</h3>
        <p className="text-gray-600 max-w-md mx-auto">
          Thank you for applying to become a {role}. We'll review your application within 24-48 hours.
        </p>
        {applicationId && (
          <p className="text-sm text-gray-500">
            Application ID: {applicationId}
          </p>
        )}
      </div>
      
      <div className="bg-blue-50 p-4 rounded-lg max-w-md mx-auto">
        <p className="text-blue-800 text-sm">
          <strong>Next Steps:</strong> Please verify your account to complete the registration process. 
          You'll receive an email with further instructions once your application is approved.
        </p>
      </div>
    </div>
  );
};

export default BecomeHostModal;