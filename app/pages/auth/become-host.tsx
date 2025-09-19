"use client";
import React, { useCallback, useState } from 'react';
import api from '@/app/api/api-conn';
import AlertNotification from '@/app/components/notify';
import { documentUploadService } from '@/app/utils/storage';

// Define the type for form data (UPDATED)
interface FormData {
  names: string;
  email: string;
  phone: string;
  country: string;
  state: string;
  city: string;
  street: string;
  province: string;
  zipCode: string;
  postalCode: string;
  postcode: string;
  pinCode: string;
  eircode: string;
  cep: string;
  experienceLevel: string;
  propertyCategories: string[];
  services: string[];
  // Tour Guide Employment Type fields
  tourGuideType: 'freelancer' | 'employed' | '';
  nationalId: string;
  companyTIN: string;
  companyName: string;
  verificationDocument: File | null;
  employmentContract: File | null;
}

// API request interface (UPDATED)
interface ServiceProviderApplicationRequest {
  names: string;
  email: string;
  phone: string;
  country: string;
  state?: string;
  province?: string;
  city?: string;
  street?: string;
  zipCode?: string;
  postalCode?: string;
  postcode?: string;
  pinCode?: string;
  eircode?: string;
  cep?: string;
  experienceLevel?: string;
  propertyCategories?: string[];
  services?: string[];
  userType: 'host' | 'tourguide' | 'agent';
  // NEW fields
  tourGuideType?: 'freelancer' | 'employed';
  nationalId?: string;
  companyTIN?: string;
  companyName?: string;
  verificationDocument?: string;
  employmentContract?: string;
}

// Define types for fields that accept string values vs array values
type StringFields = 'names' | 'email' | 'phone' | 'country' | 'state' | 'province' | 'city' | 'street' | 'zipCode' | 'postalCode' | 'postcode' | 'pinCode' | 'eircode' | 'cep' | 'experienceLevel' | 'tourGuideType' | 'nationalId' | 'companyTIN' | 'companyName';
type ArrayFields = 'propertyCategories' | 'services';

interface RoleCardProps {
  role: 'host' | 'tourguide' | 'agent';
  icon: string;
  title: string;
  description: string;
  onClick: (role: 'host' | 'tourguide' | 'agent') => void;
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

// NEW: Tour Guide Type Selection Component
interface TourGuideTypeCardProps {
  type: 'freelancer' | 'employed';
  icon: string;
  title: string;
  description: string;
  features: string[];
  onClick: (type: 'freelancer' | 'employed') => void;
}

const TourGuideTypeCard: React.FC<TourGuideTypeCardProps> = ({ type, icon, title, description, features, onClick }) => (
  <div 
    onClick={() => onClick(type)}
    className="bg-white rounded-lg border border-gray-200 hover:border-[#F20C8F] cursor-pointer transition-all duration-200 p-6 hover:shadow-md group"
  >
    <div className="space-y-4">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-[#083A85] rounded-lg flex items-center justify-center group-hover:bg-[#F20C8F] transition-colors duration-200">
          <i className={`${icon} text-white text-base`}></i>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-[#083A85] group-hover:text-[#F20C8F] transition-colors duration-200">{title}</h3>
          <p className="text-base text-gray-600">{description}</p>
        </div>
      </div>
      <div className="space-y-2">
        {features.map((feature, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div className="w-1.5 h-1.5 bg-[#F20C8F] rounded-full"></div>
            <span className="text-base text-gray-700">{feature}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// NEW: Document Upload Component
interface DocumentUploadProps {
  label: string;
  documentType: 'national_id' | 'company_tin' | 'employment_contract';
  file: File | null;
  onChange: (file: File | null) => void;
  required?: boolean;
  error?: string;
  isUploading?: boolean;
  uploadProgress?: number;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({ 
  label, 
  documentType, 
  file, 
  onChange, 
  required = false, 
  error,
  isUploading = false,
  uploadProgress = 0
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    if (selectedFile) {
      const validation = documentUploadService.validateDocument(selectedFile);
      if (validation.valid) {
        onChange(selectedFile);
      } else {
        alert(validation.error);
        e.target.value = '';
      }
    } else {
      onChange(null);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-base font-medium text-gray-700">
        {label} {required && <span className="text-[#F20C8F]">*</span>}
      </label>
      <div className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
        error ? 'border-red-300 bg-red-50' : file ? 'border-green-300 bg-green-50' : 'border-gray-300 hover:border-[#F20C8F]'
      }`}>
        <input
          type="file"
          accept=".jpg,.jpeg,.png,.pdf"
          onChange={handleFileChange}
          className="hidden"
          id={`${documentType}-upload`}
          disabled={isUploading}
        />
        <label 
          htmlFor={`${documentType}-upload`}
          className={`cursor-pointer ${isUploading ? 'pointer-events-none' : ''}`}
        >
          <div className="flex flex-col items-center space-y-2">
            <i className={`bi bi-cloud-upload text-2xl ${
              error ? 'text-red-400' : file ? 'text-green-500' : 'text-gray-400'
            }`}></i>
            {isUploading ? (
              <div className="space-y-1">
                <p className="text-base text-gray-600">Uploading... {uploadProgress}%</p>
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-[#F20C8F] h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            ) : file ? (
              <div className="space-y-1">
                <p className="text-base font-medium text-green-600">File selected:</p>
                <p className="text-base text-gray-600">{file.name}</p>
                <p className="text-xs text-gray-500">Click to change</p>
              </div>
            ) : (
              <div className="space-y-1">
                <p className="text-base font-medium text-gray-600">Click to upload document</p>
                <p className="text-xs text-gray-500">JPEG, PNG or PDF (max 5MB)</p>
              </div>
            )}
          </div>
        </label>
      </div>
      {error && (
        <p className="text-base text-red-600">{error}</p>
      )}
    </div>
  );
};

interface FormFieldProps {
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  required?: boolean;
  error?: string;
}

const experienceLevels = [
  'Entry Level (0-1 years)',
  'Junior (1-3 years)',
  'Mid-Level (3-5 years)',
  'Senior (5-10 years)',
  'Expert (10+ years)'
];

const FormField: React.FC<FormFieldProps> = ({ 
  label, 
  type = 'text', 
  value, 
  onChange, 
  placeholder, 
  required = false,
  error 
}) => (
  <div className="space-y-1.5">
    <label className="block text-base font-medium text-gray-700">
      {label} {required && <span className="text-[#F20C8F]">*</span>}
    </label>
    {type === 'select' ? (
      <select 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        className={`w-full p-2.5 sm:p-3 border rounded-md focus:border-[#F20C8F] focus:ring-1 focus:ring-[#F20C8F] focus:outline-none transition-colors duration-200 text-base sm:text-base ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
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
        className={`w-full p-2.5 sm:p-3 border rounded-md focus:border-[#F20C8F] focus:ring-1 focus:ring-[#F20C8F] focus:outline-none transition-colors duration-200 text-base sm:text-base ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
        required={required}
      />
    )}
    {error && (
      <p className="text-base text-red-600">{error}</p>
    )}
  </div>
);

interface CheckboxGroupProps {
  title: string;
  options: string[];
  selectedOptions: string[];
  onChange: (option: string) => void;
  error?: string;
}

const CheckboxGroup: React.FC<CheckboxGroupProps> = ({ 
  title, 
  options, 
  selectedOptions, 
  onChange, 
  error 
}) => (
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
    {error && (
      <p className="text-base text-red-600">{error}</p>
    )}
  </div>
);

const BecomeHost = () => {
  const [currentStep, setCurrentStep] = useState('role-selection');
  const [selectedRole, setSelectedRole] = useState<'host' | 'tourguide' | 'agent' | ''>('');
  const [formData, setFormData] = useState<FormData>({
    names: '',
    email: '',
    phone: '',
    country: '',
    state: '',
    province: '',
    city: '',
    street: '',
    zipCode: '',
    postalCode: '',
    postcode: '',
    pinCode: '',
    eircode: '',
    cep: '',
    experienceLevel: '',
    propertyCategories: [],
    services: [],
    // NEW: Tour Guide Employment Type fields
    tourGuideType: '',
    nationalId: '',
    companyTIN: '',
    companyName: '',
    verificationDocument: null,
    employmentContract: null
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [applicationId, setApplicationId] = useState<string>('');
  const [notify, setNotify] = useState<{type: "success" | "error" | "info" | "warning", message: string} | null>(null);

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

  // Handle API errors with notifications
  const handleApiError = (error: any, defaultMessage: string = "An error occurred") => {
    let errorMessage = defaultMessage;
    
    if (error.response?.data) {
      const { data } = error.response;
      
      if (data.message) {
        errorMessage = data.message;
      } else if (data.error) {
        errorMessage = data.error;
      } else if (typeof data === 'string') {
        errorMessage = data;
      }
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    setNotify({ type: 'error', message: errorMessage });
  };

  // Validate form (UPDATED to include tour guide type validation)
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    // Basic validation
    if (!formData.names.trim()) {
      errors.names = 'Full name is required';
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    }
    
    if (!formData.country.trim()) {
      errors.country = 'Country is required';
    }
    
    // Role-specific validation
    if (selectedRole === 'agent' && !formData.experienceLevel) {
      errors.experienceLevel = 'Experience level is required for field agents';
    }
    
    if ((selectedRole === 'host' || selectedRole === 'agent') && 
        formData.propertyCategories.length === 0) {
      errors.propertyCategories = 'At least one property category must be selected';
    }
    
    if (selectedRole === 'tourguide') {
      if (formData.services.length === 0) {
        errors.services = 'At least one service must be selected';
      }
      
      // NEW: Tour guide type validation
      if (!formData.tourGuideType) {
        errors.tourGuideType = 'Please select your employment type';
      }
      
      if (formData.tourGuideType === 'freelancer') {
        if (!formData.nationalId.trim()) {
          errors.nationalId = 'National ID is required for freelancers';
        }
        if (!formData.verificationDocument) {
          errors.verificationDocument = 'National ID document is required';
        }
      }
      
      if (formData.tourGuideType === 'employed') {
        if (!formData.companyTIN.trim()) {
          errors.companyTIN = 'Company TIN is required for employed tour guides';
        }
        if (!formData.companyName.trim()) {
          errors.companyName = 'Company name is required for employed tour guides';
        }
        if (!formData.verificationDocument) {
          errors.verificationDocument = 'Company TIN document is required';
        }
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = useCallback((field: StringFields, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    setFormErrors(prevErrors => {
      if (prevErrors[field]) {
        const newErrors = { ...prevErrors };
        delete newErrors[field];
        return newErrors;
      }
      return prevErrors;
    });
  }, []);

  const handleCheckboxChange = useCallback((field: ArrayFields, value: string) => {
    setFormData(prev => {
      const currentArray = prev[field];
      const newArray = currentArray.includes(value)
        ? currentArray.filter(item => item !== value)
        : [...currentArray, value];
      
      return {
        ...prev,
        [field]: newArray
      };
    });
    
    setFormErrors(prevErrors => {
      if (prevErrors[field]) {
        const newErrors = { ...prevErrors };
        delete newErrors[field];
        return newErrors;
      }
      return prevErrors;
    });
  }, []);

  // NEW: Handle document upload
  const handleDocumentChange = useCallback((documentType: 'verificationDocument' | 'employmentContract', file: File | null) => {
    setFormData(prev => ({
      ...prev,
      [documentType]: file
    }));
    
    setFormErrors(prevErrors => {
      if (prevErrors[documentType]) {
        const newErrors = { ...prevErrors };
        delete newErrors[documentType];
        return newErrors;
      }
      return prevErrors;
    });
  }, []);

  const handleRoleSelection = (role: 'host' | 'tourguide' | 'agent') => {
    setSelectedRole(role);
    if (role === 'tourguide') {
      setCurrentStep('tourguide-type-selection');
    } else {
      setCurrentStep(`${role}-form`);
    }
    setFormErrors({});
  };

  // NEW: Handle tour guide type selection
  const handleTourGuideTypeSelection = (tourGuideType: 'freelancer' | 'employed') => {
    setFormData(prev => ({
      ...prev,
      tourGuideType
    }));
    setCurrentStep('tourguide-form');
    setFormErrors({});
  };

  // Upload documents to Supabase (NEW)
  const uploadDocuments = async (userId: string): Promise<{ verificationDocument?: string; employmentContract?: string }> => {
    const uploadedUrls: { verificationDocument?: string; employmentContract?: string } = {};
    
    if (formData.verificationDocument) {
      setIsUploading(true);
      setUploadProgress(0);
      
      try {
        const documentType = formData.tourGuideType === 'freelancer' ? 'national_id' : 'company_tin';
        const url = await documentUploadService.uploadVerificationDocument(
          formData.verificationDocument,
          userId,
          documentType
        );
        uploadedUrls.verificationDocument = url;
        setUploadProgress(50);
      } catch (error: any) {
        throw new Error(`Failed to upload verification document: ${error.message}`);
      }
    }
    
    if (formData.employmentContract) {
      try {
        const url = await documentUploadService.uploadVerificationDocument(
          formData.employmentContract,
          userId,
          'employment_contract' as any
        );
        uploadedUrls.employmentContract = url;
        setUploadProgress(100);
      } catch (error: any) {
        throw new Error(`Failed to upload employment contract: ${error.message}`);
      }
    }
    
    setIsUploading(false);
    setUploadProgress(0);
    return uploadedUrls;
  };

const handleFormSubmit = async () => {
  if (!validateForm()) {
    setNotify({ type: 'warning', message: 'Please fill in all required fields correctly.' });
    return;
  }

  setLoading(true);
  
  try {
    // 1. Submit application first (without document URLs)
    const applicationData: ServiceProviderApplicationRequest = {
      names: formData.names.trim(),
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone.trim(),
      country: formData.country.trim(),
      userType: selectedRole as 'host' | 'tourguide' | 'agent',
      ...(formData.state && { state: formData.state.trim() }),
      ...(formData.province && { province: formData.province.trim() }),
      ...(formData.city && { city: formData.city.trim() }),
      ...(formData.street && { street: formData.street.trim() }),
      ...(formData.zipCode && { zipCode: formData.zipCode.trim() }),
      ...(formData.postalCode && { postalCode: formData.postalCode.trim() }),
      ...(formData.postcode && { postcode: formData.postcode.trim() }),
      ...(formData.pinCode && { pinCode: formData.pinCode.trim() }),
      ...(formData.eircode && { eircode: formData.eircode.trim() }),
      ...(formData.cep && { cep: formData.cep.trim() }),
      ...(formData.experienceLevel && { experienceLevel: formData.experienceLevel }),
      ...(formData.propertyCategories.length > 0 && { propertyCategories: formData.propertyCategories }),
      ...(formData.services.length > 0 && { services: formData.services }),
      // Tour Guide Employment Type fields (without document URLs)
      ...(formData.tourGuideType && { tourGuideType: formData.tourGuideType }),
      ...(formData.nationalId && { nationalId: formData.nationalId.trim() }),
      ...(formData.companyTIN && { companyTIN: formData.companyTIN.trim() }),
      ...(formData.companyName && { companyName: formData.companyName.trim() })
    };

    // Submit initial application
    const response = await api.post('/auth/register', applicationData);
    
    if (response.success && response.data) {
      // 2. Upload documents if provided (for tour guides only)
      if (selectedRole === 'tourguide' && (formData.verificationDocument || formData.employmentContract)) {
        setIsUploading(true);
        
        try {
          const userId = response.data.user.id.toString();
          
          // Upload verification document
          if (formData.verificationDocument) {
            setUploadProgress(25);
            const documentType = formData.tourGuideType === 'freelancer' ? 'national_id' : 'company_tin';
            const verificationUrl = await documentUploadService.uploadVerificationDocument(
              formData.verificationDocument,
              userId,
              documentType
            );
            
            setUploadProgress(50);
            
            // Update backend with verification document URL
            await api.put('/auth/me/document-url', {
              documentType: 'verification',
              documentUrl: verificationUrl
            });
            
            setUploadProgress(75);
          }

          // Upload employment contract if provided
          if (formData.employmentContract) {
            const contractUrl = await documentUploadService.uploadVerificationDocument(
              formData.employmentContract,
              userId,
              'employment_contract'
            );

            // Update backend with employment contract URL
            await api.put('/auth/me/document-url', {
              documentType: 'employment',
              documentUrl: contractUrl
            });
          }
          
          setUploadProgress(100);
          
        } catch (uploadError: any) {
          console.error('Document upload error:', uploadError);
          setNotify({ 
            type: 'warning', 
            message: 'Application submitted but document upload failed. You can upload documents later from your profile.' 
          });
        } finally {
          setIsUploading(false);
          setUploadProgress(0);
        }
      }
      
      // Store application details for verification page
      if (response.data.applicationId) {
        setApplicationId(response.data.applicationId);
        localStorage.setItem('pendingApplicationId', response.data.applicationId);
      }
      
      if (response.data.accessToken) {
        localStorage.setItem('authToken', response.data.accessToken);
      }
      
      // Store email for verification process
      localStorage.setItem('pendingVerificationEmail', formData.email.trim().toLowerCase());
      localStorage.setItem('pendingUserType', selectedRole);
      
      // Show success message
      setNotify({ 
        type: 'success', 
        message: 'Application submitted successfully! Please check your email to verify your account and set up your password.' 
      });
      
      // Redirect to verification page after a short delay
      setTimeout(() => {
        const verificationUrl = `/all/account-verification?application=true&type=${selectedRole}`;
        window.location.href = verificationUrl;
      }, 2500);
      
    } else {
      setNotify({ 
        type: 'error', 
        message: response.error || 'Application submission failed. Please try again.' 
      });
    }

  } catch (error: any) {
    console.error('Application submission error:', error);
    
    const errorData = error.response?.data || error.data;
    let errorMessage = 'Failed to submit application. Please try again.';
    
    if (errorData?.message) {
      errorMessage = errorData.message;
    } else if (errorData?.error) {
      errorMessage = errorData.error;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    if (errorMessage.includes('Please set up your password first') || 
        errorMessage.includes('Check your email for instructions') ||
        errorMessage.includes('verify your email')) {
      
      localStorage.setItem('pendingVerificationEmail', formData.email.trim().toLowerCase());
      localStorage.setItem('pendingUserType', selectedRole);
      
      setNotify({ 
        type: 'info', 
        message: 'Application received! Please check your email to verify your account and set up your password.' 
      });
      
      setTimeout(() => {
        const verificationUrl = `/all/account-verification?application=true&type=${selectedRole}`;
        window.location.href = verificationUrl;
      }, 2500);
        
    } else {
      setNotify({ type: 'error', message: errorMessage });
    }
      
  } finally {
    setLoading(false);
  }
};

  const handleFinalSubmission = async () => {
    try {
      setNotify({ type: 'success', message: 'Application completed successfully!' });
      setCurrentStep('success');
    } catch (error: any) {
      handleApiError(error, 'Failed to complete application. Please try again.');
    }
  };

  const goBack = () => {
    if (currentStep === 'tourguide-type-selection') {
      setCurrentStep('role-selection');
      setSelectedRole('');
    } else if (currentStep === 'tourguide-form') {
      setCurrentStep('tourguide-type-selection');
      setFormData(prev => ({ ...prev, tourGuideType: '' }));
    } else if (currentStep.includes('-form')) {
      setCurrentStep('role-selection');
      setSelectedRole('');
      setFormErrors({});
    } else if (currentStep === 'agreement' || currentStep === 'questions') {
      setCurrentStep(`${selectedRole}-form`);
    }
  };

  return (
    <div className='mt-12'>
      {/* AlertNotification Component */}
      {notify && (
        <AlertNotification
          type={notify.type}
          message={notify.message}
          onClose={() => setNotify(null)}
        />
      )}
      
      {/* Role Selection Step */}
      {currentStep === 'role-selection' && (
        <div className="bg-gray-50">
          <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css" rel="stylesheet" />
          
          <div className="">
            <div className="max-w-4xl mx-auto px-6 py-20">
              <div className="text-center space-y-3">
                <div className="inline-flex items-center px-3 py-1.5 bg-[#F20C8F] bg-opacity-10 text-white text-base font-medium rounded-full">
                  Join Our Platform
                </div>
                <h1 className="text-lg sm:text-2xl lg:text-2xl font-medium text-[#083A85]">Become a Service Provider</h1>
                <p className="text-base sm:text-base text-gray-600 max-w-lg mx-auto px-4">
                  Choose your role and start your journey with us. Whether you're a property owner, field agent, or tour guide.
                </p>
              </div>
            </div>
          </div>

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
                  role="agent"
                  icon="bi bi-people"
                  title="Field Agent"
                  description="Help clients find their perfect property, provide expert guidance, and earn competitive commissions."
                  onClick={handleRoleSelection}
                />
                <RoleCard
                  role="tourguide"
                  icon="bi bi-geo-alt"
                  title="Tour Guide"
                  description="Offer unforgettable guided tours, showcase local attractions, and share your passion for travel."
                  onClick={handleRoleSelection}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* NEW: Tour Guide Type Selection Step */}
      {currentStep === 'tourguide-type-selection' && (
        <div className="bg-gray-50">
          <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css" rel="stylesheet" />
          
          <div className="bg-white border-b border-gray-200">
            <div className="max-w-4xl mx-auto px-6 py-6">
              <div className="flex items-center space-x-3">
                <button 
                  onClick={goBack} 
                  className="p-1.5 sm:p-2 text-[#083A85] hover:bg-gray-100 rounded-md transition-colors duration-200 flex-shrink-0 cursor-pointer"
                >
                  <i className="bi bi-chevron-left text-lg cursor-pointer"></i>
                </button>
                <div className="min-w-0">
                  <h2 className="text-lg sm:text-xl font-bold text-[#083A85] truncate">Choose Your Tour Guide Type</h2>
                  <p className="text-base text-gray-600">Select your employment status to continue</p>
                </div>
              </div>
            </div>
          </div>

          <div className="px-4 sm:px-6 py-12">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <TourGuideTypeCard
                  type="freelancer"
                  icon="bi bi-person-badge"
                  title="Freelancer (Self-Employed)"
                  description="Independent tour guide working for yourself"
                  features={[
                    "Set your own rates and schedule",
                    "Direct client relationships",
                    "Full control over your services",
                    "Higher earning potential",
                    "Complete business autonomy"
                  ]}
                  onClick={handleTourGuideTypeSelection}
                />
                <TourGuideTypeCard
                  type="employed"
                  icon="bi bi-building"
                  title="Company"
                  description="Working as a tour company"
                  features={[
                    "Stable salary and benefits",
                    "Company-provided training",
                    "Marketing and client support",
                    "Group bookings and resources",
                    "Professional development opportunities"
                  ]}
                  onClick={handleTourGuideTypeSelection}
                />
              </div>
              
              <div className="mt-8 text-center">
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg max-w-2xl mx-auto">
                  <div className="flex items-start space-x-3">
                    <i className="bi bi-info-circle text-blue-500 text-lg mt-0.5"></i>
                    <div className="text-left">
                      <h4 className="font-medium text-blue-800 mb-1">Document Requirements</h4>
                      <p className="text-base text-blue-700">
                        <strong>Freelancers:</strong> Need to upload National ID for verification<br/>
                        <strong>Company:</strong> Need to upload Company Registration document for verification
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Form Steps (UPDATED to include tour guide employment fields) */}
      {currentStep.includes('-form') && (
        <div className="pt-4">
          <div className="bg-white border-b border-gray-200">
            <div className="max-w-3xl mx-auto px-6 py-6">
              <div className="flex items-center space-x-3">
                <button 
                  onClick={goBack} 
                  className="p-1.5 sm:p-2 text-[#083A85] hover:bg-gray-100 rounded-md transition-colors duration-200 flex-shrink-0 cursor-pointer"
                  disabled={loading || isUploading}
                >
                  <i className="bi bi-chevron-left text-lg cursor-pointer"></i>
                </button>
                <div className="min-w-0">
                  <h2 className="text-lg sm:text-xl font-bold text-[#083A85] truncate">
                    {selectedRole === 'host' && 'Property Owner Application'}
                    {selectedRole === 'agent' && 'Field Agent Application'}
                    {selectedRole === 'tourguide' && `${formData.tourGuideType === 'freelancer' ? 'Freelance ' : 'Company '}Tour Guide Application`}
                  </h2>
                  <p className="text-base text-gray-600">Please fill in your details to get started</p>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-3xl mx-auto px-6 py-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="space-y-6">
                {/* Personal Information Section */}
                <div className="space-y-4 sm:space-y-6">
                  <h3 className="text-base sm:text-lg font-semibold text-[#083A85] pb-2 border-b border-gray-200">
                    Personal Information
                  </h3>
                  
                  <FormField
                    label="Full Name"
                    value={formData.names}
                    onChange={(value) => handleInputChange('names', value)}
                    placeholder="Enter your full name"
                    required
                    error={formErrors.names}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      label="Email Address"
                      type="email"
                      value={formData.email}
                      onChange={(value) => handleInputChange('email', value)}
                      placeholder="Enter your email address"
                      required
                      error={formErrors.email}
                    />
                    <FormField
                      label="Phone Number"
                      type="tel"
                      value={formData.phone}
                      onChange={(value) => handleInputChange('phone', value)}
                      placeholder="Enter your phone number"
                      required
                      error={formErrors.phone}
                    />
                  </div>
                </div>

                {/* Location Information Section */}
                <div className="space-y-4 sm:space-y-6">
                  <h3 className="text-base sm:text-lg font-semibold text-[#083A85] pb-2 border-b border-gray-200">
                    Location Information
                  </h3>
                  
                  <FormField
                    label="Country"
                    value={formData.country}
                    onChange={(value) => handleInputChange('country', value)}
                    placeholder="Enter your country"
                    required
                    error={formErrors.country}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      label="State"
                      value={formData.state}
                      onChange={(value) => handleInputChange('state', value)}
                      placeholder="Enter your state"
                    />
                    <FormField
                      label="Province"
                      value={formData.province}
                      onChange={(value) => handleInputChange('province', value)}
                      placeholder="Enter your province"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      label="City"
                      value={formData.city}
                      onChange={(value) => handleInputChange('city', value)}
                      placeholder="Enter your city"
                    />
                    <FormField
                      label="Street Address"
                      value={formData.street}
                      onChange={(value) => handleInputChange('street', value)}
                      placeholder="Enter your street address"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <FormField
                      label="ZIP Code"
                      value={formData.zipCode}
                      onChange={(value) => handleInputChange('zipCode', value)}
                      placeholder="ZIP Code"
                    />
                    <FormField
                      label="Postal Code"
                      value={formData.postalCode}
                      onChange={(value) => handleInputChange('postalCode', value)}
                      placeholder="Postal Code"
                    />
                    <FormField
                      label="Postcode"
                      value={formData.postcode}
                      onChange={(value) => handleInputChange('postcode', value)}
                      placeholder="Postcode"
                    />
                  </div>
                </div>

                {/* Role-specific Information */}
                <div className="space-y-4 sm:space-y-6">
                  <h3 className="text-base sm:text-lg font-semibold text-[#083A85] pb-2 border-b border-gray-200">
                    Professional Information
                  </h3>

                  {selectedRole === 'agent' && (
                    <FormField
                      label="Experience Level"
                      type="select"
                      value={formData.experienceLevel}
                      onChange={(value) => handleInputChange('experienceLevel', value)}
                      placeholder="Select your experience level"
                      required
                      error={formErrors.experienceLevel}
                    />
                  )}

                  {(selectedRole === 'host' || selectedRole === 'agent') && (
                    <CheckboxGroup
                      title="Property Categories"
                      options={propertyCategories}
                      selectedOptions={formData.propertyCategories}
                      onChange={(option) => handleCheckboxChange('propertyCategories', option)}
                      error={formErrors.propertyCategories}
                    />
                  )}

                  {selectedRole === 'tourguide' && (
                    <>
                      <CheckboxGroup
                        title="Services Offered"
                        options={tourServices}
                        selectedOptions={formData.services}
                        onChange={(option) => handleCheckboxChange('services', option)}
                        error={formErrors.services}
                      />

                      {/* NEW: Tour Guide Employment Type Fields */}
                      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                        <div className="flex items-center space-x-2 mb-3">
                          <i className="bi bi-briefcase text-[#083A85]"></i>
                          <h4 className="font-medium text-[#083A85]">
                            Employment Type: {formData.tourGuideType === 'freelancer' ? 'Freelancer (Self-Employed)' : 'Company'}
                          </h4>
                        </div>

                        {formData.tourGuideType === 'freelancer' && (
                          <div className="space-y-4">
                            <FormField
                              label="National ID Number"
                              value={formData.nationalId}
                              onChange={(value) => handleInputChange('nationalId', value)}
                              placeholder="Enter your National ID number"
                              required
                              error={formErrors.nationalId}
                            />
                            <DocumentUpload
                              label="Upload National ID Document (Front & Back View)"
                              documentType="national_id"
                              file={formData.verificationDocument}
                              onChange={(file) => handleDocumentChange('verificationDocument', file)}
                              required
                              error={formErrors.verificationDocument}
                              isUploading={isUploading}
                              uploadProgress={uploadProgress}
                            />
                          </div>
                        )}

                        {formData.tourGuideType === 'employed' && (
                          <div className="space-y-4">
                            <FormField
                              label="Company Name"
                              value={formData.companyName}
                              onChange={(value) => handleInputChange('companyName', value)}
                              placeholder="Enter your company name"
                              required
                              error={formErrors.companyName}
                            />
                            <FormField
                              label="Company Registration Number"
                              value={formData.companyTIN}
                              onChange={(value) => handleInputChange('companyTIN', value)}
                              placeholder="Enter company Registration number"
                              required
                              error={formErrors.companyTIN}
                            />
                            <DocumentUpload
                              label="Upload Company Registration Document"
                              documentType="company_tin"
                              file={formData.verificationDocument}
                              onChange={(file) => handleDocumentChange('verificationDocument', file)}
                              required
                              error={formErrors.verificationDocument}
                              isUploading={isUploading}
                              uploadProgress={uploadProgress}
                            />
                           
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:justify-end mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200 space-y-3 sm:space-y-0 sm:space-x-3">
                <button
                  onClick={handleFormSubmit}
                  disabled={loading || isUploading}
                  className={`w-full sm:w-auto font-medium py-2.5 sm:py-3 px-6 sm:px-8 rounded-md transition-colors duration-200 text-base sm:text-base cursor-pointer ${
                    loading || isUploading
                      ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                      : 'bg-[#F20C8F] hover:bg-[#d10b7a] text-white'
                  }`}
                >
                  {isUploading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Uploading Documents... {uploadProgress}%
                    </div>
                  ) : loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </div>
                  ) : (
                    'Continue Application'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Other existing steps (agreement, questions, success) remain the same... */}
      {currentStep === 'success' && (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
          <div className="max-w-lg mx-auto">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <div className="space-y-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mx-auto">
                  <i className="bi bi-check-circle text-xl sm:text-2xl"></i>
                </div>

                <div className="space-y-2 sm:space-y-3">
                  <h2 className="text-xl sm:text-2xl font-bold text-[#083A85]">Application Submitted!</h2>
                  <p className="text-base sm:text-base text-gray-600 leading-relaxed px-2">
                    Your {selectedRole === 'host' ? 'Property Owner' : selectedRole === 'tourguide' ? 
                      `${formData.tourGuideType === 'freelancer' ? 'Freelance' : 'Employed'} Tour Guide` : 'Field Agent'} application has been submitted successfully!
                  </p>
                  <p className="text-base text-gray-600 leading-relaxed px-2">
                    Please check your email to verify your account and set up your password to complete the process.
                  </p>
                  {applicationId && (
                    <p className="text-base text-gray-500">
                      Application ID: <span className="font-mono font-medium">{applicationId}</span>
                    </p>
                  )}
                </div>

                <div className="flex flex-col space-y-3">
                  <button
                    onClick={() => {
                      const verificationUrl = `/all/account-verification?application=true&type=${selectedRole}`;
                      window.location.href = verificationUrl;
                    }}
                    className="w-full bg-[#F20C8F] hover:bg-[#d10b7a] text-white font-medium py-2.5 sm:py-3 px-6 sm:px-8 rounded-md transition-colors duration-200 text-base sm:text-base cursor-pointer"
                  >
                    Verify Account & Set Password
                  </button>
                  
                  <button
                    onClick={() => {
                      setCurrentStep('role-selection');
                      setSelectedRole('');
                      setFormData({
                        names: '', email: '', phone: '', country: '', state: '', province: '',
                        city: '', street: '', zipCode: '', postalCode: '', postcode: '', pinCode: '',
                        eircode: '', cep: '', experienceLevel: '', propertyCategories: [], services: [],
                        tourGuideType: '', nationalId: '', companyTIN: '', companyName: '',
                        verificationDocument: null, employmentContract: null
                      });
                      setApplicationId('');
                      setFormErrors({});
                      setNotify(null);
                      localStorage.removeItem('pendingApplicationId');
                      localStorage.removeItem('pendingVerificationEmail');
                      localStorage.removeItem('pendingUserType');
                    }}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2.5 sm:py-3 px-6 sm:px-8 rounded-md transition-colors duration-200 text-base sm:text-base cursor-pointer"
                  >
                    Submit Another Application
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BecomeHost;