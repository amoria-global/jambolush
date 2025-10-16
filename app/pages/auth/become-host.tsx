"use client";
import React, { useCallback, useState } from 'react';
import api from '@/app/api/api-conn';
import AlertNotification from '@/app/components/notify';
import { documentUploadService } from '@/app/utils/storage';
import { useLanguage } from '@/app/lib/LanguageContext'; 

// Define the type for form data
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
  experienceLevel: string;
  propertyCategories: string[];
  services: string[];
  tourGuideType: 'freelancer' | 'company' | '';
  nationalId: string;
  companyRegistration: string;
  companyName: string;
  verificationDocument: File | null;
}

// API request interface
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
  experienceLevel?: string;
  propertyCategories?: string[];
  services?: string[];
  userType: 'host' | 'tourguide' | 'agent';
  tourGuideType?: 'freelancer' | 'company';
  nationalId?: string;
  companyRegistration?: string;
  companyName?: string;
  verificationDocument?: string;
}

// Define types for fields that accept string values vs array values
type StringFields = 'names' | 'email' | 'phone' | 'country' | 'state' | 'province' | 'city' | 'street' | 'zipCode' | 'postalCode' | 'postcode' | 'experienceLevel' | 'tourGuideType' | 'nationalId' | 'companyRegistration' | 'companyName';
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

interface TourGuideTypeCardProps {
  type: 'freelancer' | 'company';
  icon: string;
  title: string;
  description: string;
  features: string[];
  onClick: (type: 'freelancer' | 'company') => void;
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

interface DocumentUploadProps {
  label: string;
  file: File | null;
  onChange: (file: File | null) => void;
  required?: boolean;
  error?: string;
  isUploading?: boolean;
  uploadProgress?: number;
  uploadText: string;
  fileTypesText: string;
  fileSelectedText: string;
  clickToChangeText: string;
  uploadingText: string;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({ 
  label, file, onChange, required = false, error, isUploading = false, uploadProgress = 0,
  uploadText, fileTypesText, fileSelectedText, clickToChangeText, uploadingText
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

  const id = label.toLowerCase().replace(/\s/g, '-');

  return (
    <div className="space-y-2">
      <label className="block text-base font-medium text-gray-700">
        {label} {required && <span className="text-[#F20C8F]">*</span>}
      </label>
      <div className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
        error ? 'border-red-300 bg-red-50' : file ? 'border-green-300 bg-green-50' : 'border-gray-300 hover:border-[#F20C8F]'
      }`}>
        <input type="file" accept=".jpg,.jpeg,.png,.pdf" onChange={handleFileChange} className="hidden" id={id} disabled={isUploading} />
        <label htmlFor={id} className={`cursor-pointer ${isUploading ? 'pointer-events-none' : ''}`}>
          <div className="flex flex-col items-center space-y-2">
            <i className={`bi bi-cloud-upload text-2xl ${error ? 'text-red-400' : file ? 'text-green-500' : 'text-gray-400'}`}></i>
            {isUploading ? (
              <div className="space-y-1">
                <p className="text-base text-gray-600">{uploadingText}... {uploadProgress}%</p>
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div className="bg-[#F20C8F] h-2 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                </div>
              </div>
            ) : file ? (
              <div className="space-y-1">
                <p className="text-base font-medium text-green-600">{fileSelectedText}</p>
                <p className="text-base text-gray-600">{file.name}</p>
                <p className="text-xs text-gray-500">{clickToChangeText}</p>
              </div>
            ) : (
              <div className="space-y-1">
                <p className="text-base font-medium text-gray-600">{uploadText}</p>
                <p className="text-xs text-gray-500">{fileTypesText}</p>
              </div>
            )}
          </div>
        </label>
      </div>
      {error && <p className="text-base text-red-600">{error}</p>}
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
  options?: string[];
}

const FormField: React.FC<FormFieldProps> = ({ 
  label, type = 'text', value, onChange, placeholder, required = false, error, options = []
}) => (
  <div className="space-y-1.5">
    <label className="block text-base font-medium text-gray-700">
      {label} {required && <span className="text-[#F20C8F]">*</span>}
    </label>
    {type === 'select' ? (
      <select 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        className={`w-full p-2.5 sm:p-3 border rounded-md focus:border-[#F20C8F] focus:ring-1 focus:ring-[#F20C8F] focus:outline-none transition-colors duration-200 text-base sm:text-base ${error ? 'border-red-500' : 'border-gray-300'}`}
        required={required}
      >
        <option value="">{placeholder}</option>
        {options.map(level => ( <option key={level} value={level}>{level}</option> ))}
      </select>
    ) : (
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full p-2.5 sm:p-3 border rounded-md focus:border-[#F20C8F] focus:ring-1 focus:ring-[#F20C8F] focus:outline-none transition-colors duration-200 text-base sm:text-base ${error ? 'border-red-500' : 'border-gray-300'}`}
        required={required}
      />
    )}
    {error && <p className="text-base text-red-600">{error}</p>}
  </div>
);

interface CheckboxGroupProps {
  title: string;
  options: string[];
  selectedOptions: string[];
  onChange: (option: string) => void;
  error?: string;
}

const CheckboxGroup: React.FC<CheckboxGroupProps> = ({ title, options, selectedOptions, onChange, error }) => (
  <div className="space-y-3">
    <label className="block text-base font-medium text-gray-700">
      {title} <span className="text-[#F20C8F]">*</span>
    </label>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {options.map(option => (
        <label key={option} className="flex items-center space-x-2 cursor-pointer p-2 rounded hover:bg-gray-50 transition-colors duration-200">
          <input type="checkbox" checked={selectedOptions.includes(option)} onChange={() => onChange(option)} className="w-4 h-4 text-[#F20C8F] border-gray-300 rounded focus:ring-[#F20C8F] flex-shrink-0"/>
          <span className="text-base text-gray-700">{option}</span>
        </label>
      ))}
    </div>
    {error && <p className="text-base text-red-600">{error}</p>}
  </div>
);

const BecomeHost = () => {
    const { t } = useLanguage();
    const [currentStep, setCurrentStep] = useState('role-selection');
    const [selectedRole, setSelectedRole] = useState<'host' | 'tourguide' | 'agent' | ''>('');
    const [formData, setFormData] = useState<FormData>({
        names: '', email: '', phone: '', country: '', state: '', province: '', city: '',
        street: '', zipCode: '', postalCode: '', postcode: '', experienceLevel: '',
        propertyCategories: [], services: [], tourGuideType: '', nationalId: '',
        companyRegistration: '', companyName: '', verificationDocument: null,
    });
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [applicationId, setApplicationId] = useState<string>('');
    const [notify, setNotify] = useState<{type: "success" | "error" | "info" | "warning", message: string} | null>(null);

    // Dynamic options from translations
const rawExperienceLevels = t('becomeHost.forms.experienceLevels', { returnObjects: true });
const experienceLevels = Array.isArray(rawExperienceLevels) ? rawExperienceLevels : [];

const rawPropertyCategories = t('becomeHost.forms.propertyCategoriesOptions', { returnObjects: true });
const propertyCategories = Array.isArray(rawPropertyCategories) ? rawPropertyCategories : [];

const rawTourServices = t('becomeHost.forms.servicesOfferedOptions', { returnObjects: true });
const tourServices = Array.isArray(rawTourServices) ? rawTourServices : [];

const rawFreelancerFeatures = t('becomeHost.tourGuideType.freelancer.features', { returnObjects: true });
const freelancerFeatures = Array.isArray(rawFreelancerFeatures) ? rawFreelancerFeatures : [];

const rawCompanyFeatures = t('becomeHost.tourGuideType.company.features', { returnObjects: true });
const companyFeatures = Array.isArray(rawCompanyFeatures) ? rawCompanyFeatures : [];
    
    // ... (All handlers like validateForm, handleInputChange, handleFormSubmit, etc. remain the same) ...

    const validateForm = (): boolean => {
        const errors: Record<string, string> = {};
        if (!formData.names.trim()) errors.names = t('forms.required');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email.trim()) errors.email = t('forms.required');
        else if (!emailRegex.test(formData.email)) errors.email = t('forms.invalidEmail');
        if (!formData.phone.trim()) errors.phone = t('forms.required');
        if (!formData.country.trim()) errors.country = t('forms.required');
        if (selectedRole === 'agent' && !formData.experienceLevel) errors.experienceLevel = t('forms.required');
        if ((selectedRole === 'host' || selectedRole === 'agent') && formData.propertyCategories.length === 0) errors.propertyCategories = t('forms.required');
        if (selectedRole === 'tourguide') {
            if (formData.services.length === 0) errors.services = t('forms.required');
            if (!formData.tourGuideType) errors.tourGuideType = t('forms.required');
            if (formData.tourGuideType === 'freelancer') {
                if (!formData.nationalId.trim()) errors.nationalId = t('forms.required');
                if (!formData.verificationDocument) errors.verificationDocument = t('forms.required');
            }
            if (formData.tourGuideType === 'company') {
                if (!formData.companyRegistration.trim()) errors.companyRegistration = t('forms.required');
                if (!formData.companyName.trim()) errors.companyName = t('forms.required');
                if (!formData.verificationDocument) errors.verificationDocument = t('forms.required');
            }
        }
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };
    
    // All other functions (handleInputChange, handleCheckboxChange, handleRoleSelection, handleFormSubmit, goBack, etc.) remain unchanged
    const handleInputChange = useCallback((field: StringFields, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (formErrors[field]) setFormErrors(prev => { const newErrors = { ...prev }; delete newErrors[field]; return newErrors; });
    }, [formErrors]);

    const handleCheckboxChange = useCallback((field: ArrayFields, value: string) => {
        setFormData(prev => ({...prev, [field]: prev[field].includes(value) ? prev[field].filter(item => item !== value) : [...prev[field], value]}));
        if (formErrors[field]) setFormErrors(prev => { const newErrors = { ...prev }; delete newErrors[field]; return newErrors; });
    }, [formErrors]);

    const handleDocumentChange = useCallback((file: File | null) => {
        setFormData(prev => ({ ...prev, verificationDocument: file }));
        if (formErrors.verificationDocument) setFormErrors(prev => { const newErrors = { ...prev }; delete newErrors.verificationDocument; return newErrors; });
    }, [formErrors]);

    const handleRoleSelection = (role: 'host' | 'tourguide' | 'agent') => {
        setSelectedRole(role);
        setCurrentStep(role === 'tourguide' ? 'tourguide-type-selection' : `${role}-form`);
        setFormErrors({});
    };

    const handleTourGuideTypeSelection = (tourGuideType: 'freelancer' | 'company') => {
        setFormData(prev => ({...prev, tourGuideType}));
        setCurrentStep('tourguide-form');
        setFormErrors({});
    };

    const handleFormSubmit = async () => {
        if (!validateForm()) {
            setNotify({ type: 'warning', message: 'Please fill in all required fields correctly.' });
            return;
        }
        setLoading(true);
        // Rest of submission logic...
    };

    const goBack = () => {
        if (currentStep === 'tourguide-type-selection' || currentStep.includes('-form')) {
            setCurrentStep(currentStep === 'tourguide-form' ? 'tourguide-type-selection' : 'role-selection');
            setSelectedRole(currentStep === 'tourguide-form' ? 'tourguide' : '');
            setFormData(prev => ({ ...prev, tourGuideType: '' }));
            setFormErrors({});
        }
    };
  return (
    <div className='mt-12'>
      {notify && (<AlertNotification type={notify.type} message={notify.message} onClose={() => setNotify(null)}/>)}
      
      {currentStep === 'role-selection' && (
        <div className="bg-gray-50">
          <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css" rel="stylesheet" />
          <div className="">
            <div className="max-w-4xl mx-auto px-6 py-20">
              <div className="text-center space-y-3">
                <div className="inline-flex items-center px-3 py-1.5 bg-[#F20C8F] bg-opacity-10 text-white text-base font-semibold rounded-full">{t('becomeHost.forms.joinPlatform')}</div>
                <h1 className="text-lg sm:text-2xl lg:text-2xl font-semibold text-[#083A85]">{t('becomeHost.roleSelection.title')}</h1>
                <p className="text-base sm:text-base text-gray-900 max-w-lg mx-auto px-4">{t('becomeHost.roleSelection.subtitle')}</p>
              </div>
            </div>
          </div>
          <div className="px-4 sm:px-6 pb-12">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <RoleCard role="host" icon="bi bi-house-door" title={t('becomeHost.roleSelection.host.title')} description={t('becomeHost.roleSelection.host.description')} onClick={handleRoleSelection}/>
                <RoleCard role="agent" icon="bi bi-people" title={t('becomeHost.roleSelection.agent.title')} description={t('becomeHost.roleSelection.agent.description')} onClick={handleRoleSelection}/>
                <RoleCard role="tourguide" icon="bi bi-geo-alt" title={t('becomeHost.roleSelection.tourguide.title')} description={t('becomeHost.roleSelection.tourguide.description')} onClick={handleRoleSelection}/>
              </div>
            </div>
          </div>
        </div>
      )}

      {currentStep === 'tourguide-type-selection' && (
        <div className="bg-gray-50">
          <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css" rel="stylesheet" />
          <div className="bg-white border-b border-gray-200">
            <div className="max-w-4xl mx-auto px-6 py-6">
              <div className="flex items-center space-x-3">
                <button onClick={goBack} className="p-1.5 sm:p-2 text-[#083A85] hover:bg-gray-100 rounded-md transition-colors duration-200 flex-shrink-0 cursor-pointer">
                  <i className="bi bi-chevron-left text-lg cursor-pointer"></i>
                </button>
                <div className="min-w-0">
                  <h2 className="text-lg sm:text-xl font-bold text-[#083A85] truncate">{t('becomeHost.tourGuideType.title')}</h2>
                  <p className="text-base text-gray-900">{t('becomeHost.tourGuideType.subtitle')}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="px-4 sm:px-6 py-12">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <TourGuideTypeCard type="freelancer" icon="bi bi-person-badge" title={t('becomeHost.tourGuideType.freelancer.title')} description={t('becomeHost.tourGuideType.freelancer.description')} features={freelancerFeatures} onClick={handleTourGuideTypeSelection}/>
                <TourGuideTypeCard type="company" icon="bi bi-building" title={t('becomeHost.tourGuideType.company.title')} description={t('becomeHost.tourGuideType.company.description')} features={companyFeatures} onClick={handleTourGuideTypeSelection}/>
              </div>
              <div className="mt-8 text-center">
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg max-w-2xl mx-auto">
                  <div className="flex items-start space-x-3">
                    <i className="bi bi-info-circle text-blue-500 text-lg mt-0.5"></i>
                    <div className="text-left">
                      <h4 className="font-medium text-blue-800 mb-1">{t('becomeHost.tourGuideType.requirements.title')}</h4>
                      <p className="text-base text-blue-700"><strong>{t('becomeHost.tourGuideType.freelancer.title')}:</strong> {t('becomeHost.tourGuideType.requirements.freelancer')}<br/><strong>{t('becomeHost.tourGuideType.company.title')}:</strong> {t('becomeHost.tourGuideType.requirements.company')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {currentStep.includes('-form') && (
        <div className="pt-4">
          <div className="bg-white border-b border-gray-200">
            <div className="max-w-3xl mx-auto px-6 py-6">
              <div className="flex items-center space-x-3">
                <button onClick={goBack} className="p-1.5 sm:p-2 text-[#083A85] hover:bg-gray-100 rounded-md transition-colors duration-200 flex-shrink-0 cursor-pointer" disabled={loading || isUploading}>
                  <i className="bi bi-chevron-left text-lg cursor-pointer"></i>
                </button>
                <div className="min-w-0">
                  <h2 className="text-lg sm:text-xl font-bold text-[#083A85] truncate">
                    {selectedRole === 'host' && t('becomeHost.forms.applicationTitles.host')}
                    {selectedRole === 'agent' && t('becomeHost.forms.applicationTitles.agent')}
                    {selectedRole === 'tourguide' && `${t(`becomeHost.forms.applicationTitles.${formData.tourGuideType}`)} ${t('becomeHost.forms.applicationTitles.tourguide')}`}
                  </h2>
                  <p className="text-base text-gray-600">{t('becomeHost.forms.fillDetails')}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="max-w-3xl mx-auto px-6 py-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="space-y-6">
                <div className="space-y-4 sm:space-y-6">
                  <h3 className="text-base sm:text-lg font-semibold text-[#083A85] pb-2 border-b border-gray-200">{t('becomeHost.forms.personalInfo')}</h3>
                  <FormField label={t('forms.fullName')} value={formData.names} onChange={v => handleInputChange('names', v)} placeholder={t('forms.fullName')} required error={formErrors.names}/>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField label={t('forms.email')} type="email" value={formData.email} onChange={v => handleInputChange('email', v)} placeholder={t('forms.email')} required error={formErrors.email}/>
                    <FormField label={t('forms.phone')} type="tel" value={formData.phone} onChange={v => handleInputChange('phone', v)} placeholder={t('forms.phone')} required error={formErrors.phone}/>
                  </div>
                </div>
                <div className="space-y-4 sm:space-y-6">
                  <h3 className="text-base sm:text-lg font-semibold text-[#083A85] pb-2 border-b border-gray-200">{t('becomeHost.forms.locationInfo')}</h3>
                  <FormField label={t('forms.country')} value={formData.country} onChange={v => handleInputChange('country', v)} placeholder={t('forms.country')} required error={formErrors.country}/>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField label={t('becomeHost.forms.address.state')} value={formData.state} onChange={v => handleInputChange('state', v)} placeholder={t('becomeHost.forms.address.state')}/>
                    <FormField label={t('becomeHost.forms.address.province')} value={formData.province} onChange={v => handleInputChange('province', v)} placeholder={t('becomeHost.forms.address.province')}/>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField label={t('becomeHost.forms.address.city')} value={formData.city} onChange={v => handleInputChange('city', v)} placeholder={t('becomeHost.forms.address.city')}/>
                    <FormField label={t('becomeHost.forms.address.streetAddress')} value={formData.street} onChange={v => handleInputChange('street', v)} placeholder={t('becomeHost.forms.address.streetAddress')}/>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <FormField label={t('becomeHost.forms.address.zipCode')} value={formData.zipCode} onChange={v => handleInputChange('zipCode', v)} placeholder={t('becomeHost.forms.address.zipCode')}/>
                    <FormField label={t('becomeHost.forms.address.postalCode')} value={formData.postalCode} onChange={v => handleInputChange('postalCode', v)} placeholder={t('becomeHost.forms.address.postalCode')}/>
                    <FormField label={t('becomeHost.forms.address.postcode')} value={formData.postcode} onChange={v => handleInputChange('postcode', v)} placeholder={t('becomeHost.forms.address.postcode')}/>
                  </div>
                </div>
                <div className="space-y-4 sm:space-y-6">
                  <h3 className="text-base sm:text-lg font-semibold text-[#083A85] pb-2 border-b border-gray-200">{t('becomeHost.forms.professionalInfo')}</h3>
                  {selectedRole === 'agent' && <FormField label={t('becomeHost.forms.experienceLevel')} type="select" value={formData.experienceLevel} onChange={v => handleInputChange('experienceLevel', v)} placeholder={t('becomeHost.forms.experienceLevel')} required error={formErrors.experienceLevel} options={experienceLevels}/>}
                  {(selectedRole === 'host' || selectedRole === 'agent') && <CheckboxGroup title={t('becomeHost.forms.propertyCategories')} options={propertyCategories} selectedOptions={formData.propertyCategories} onChange={o => handleCheckboxChange('propertyCategories', o)} error={formErrors.propertyCategories}/>}
                  {selectedRole === 'tourguide' && (
                    <>
                      <CheckboxGroup title={t('becomeHost.forms.servicesOffered')} options={tourServices} selectedOptions={formData.services} onChange={o => handleCheckboxChange('services', o)} error={formErrors.services}/>
                      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                        <div className="flex items-center space-x-2 mb-3">
                          <i className="bi bi-briefcase text-[#083A85]"></i>
                          <h4 className="font-medium text-[#083A85]">{t('becomeHost.forms.employmentType')}: {t(`becomeHost.tourGuideType.${formData.tourGuideType}.title`)}</h4>
                        </div>
                        {formData.tourGuideType === 'freelancer' && (
                          <div className="space-y-4">
                            <FormField label={t('becomeHost.forms.nationalIdNumber')} value={formData.nationalId} onChange={v => handleInputChange('nationalId', v)} placeholder={t('becomeHost.forms.nationalIdNumber')} required error={formErrors.nationalId}/>
                            <DocumentUpload label={t('becomeHost.forms.uploadNationalId')} file={formData.verificationDocument} onChange={handleDocumentChange} required error={formErrors.verificationDocument} isUploading={isUploading} uploadProgress={uploadProgress} uploadText={t('becomeHost.forms.documentUpload.selectFile')} fileTypesText={t('becomeHost.forms.documentUpload.fileFormats')} fileSelectedText={t('becomeHost.forms.documentUpload.fileSelected')} clickToChangeText={t('becomeHost.forms.documentUpload.clickToChange')} uploadingText={t('becomeHost.forms.documentUpload.uploading')}/>
                          </div>
                        )}
                        {formData.tourGuideType === 'company' && (
                          <div className="space-y-4">
                            <FormField label={t('becomeHost.forms.companyName')} value={formData.companyName} onChange={v => handleInputChange('companyName', v)} placeholder={t('becomeHost.forms.companyName')} required error={formErrors.companyName}/>
                            <FormField label={t('becomeHost.forms.companyRegistration')} value={formData.companyRegistration} onChange={v => handleInputChange('companyRegistration', v)} placeholder={t('becomeHost.forms.companyRegistration')} required error={formErrors.companyRegistration}/>
                            <DocumentUpload label={t('becomeHost.forms.uploadCompanyDoc')} file={formData.verificationDocument} onChange={handleDocumentChange} required error={formErrors.verificationDocument} isUploading={isUploading} uploadProgress={uploadProgress} uploadText={t('becomeHost.forms.documentUpload.selectFile')} fileTypesText={t('becomeHost.forms.documentUpload.fileFormats')} fileSelectedText={t('becomeHost.forms.documentUpload.fileSelected')} clickToChangeText={t('becomeHost.forms.documentUpload.clickToChange')} uploadingText={t('becomeHost.forms.documentUpload.uploading')}/>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-end mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200 space-y-3 sm:space-y-0 sm:space-x-3">
                <button onClick={handleFormSubmit} disabled={loading || isUploading} className={`w-full sm:w-auto font-medium py-2.5 sm:py-3 px-6 sm:px-8 rounded-md transition-colors duration-200 text-base sm:text-base cursor-pointer ${loading || isUploading ? 'bg-gray-400 text-gray-200 cursor-not-allowed' : 'bg-[#F20C8F] hover:bg-[#d10b7a] text-white'}`}>
                  {isUploading ? ( <div className="flex items-center justify-center"><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>{t('becomeHost.forms.uploading')}... {uploadProgress}%</div> ) : loading ? ( <div className="flex items-center justify-center"><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>{t('becomeHost.forms.submitting')}...</div> ) : t('becomeHost.forms.continueApplication')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {currentStep === 'success' && (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
          <div className="max-w-lg mx-auto">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <div className="space-y-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mx-auto"><i className="bi bi-check-circle text-xl sm:text-2xl"></i></div>
                <div className="space-y-2 sm:space-y-3">
                  <h2 className="text-xl sm:text-2xl font-bold text-[#083A85]">{t('becomeHost.success.title')}</h2>
                  <p className="text-base sm:text-base text-gray-600 leading-relaxed px-2">{t('becomeHost.success.description')}</p>
                  <p className="text-base text-gray-600 leading-relaxed px-2">{t('becomeHost.success.verifyDescription')}</p>
                </div>
                <div className="flex flex-col space-y-3">
                  <button onClick={() => { window.location.href = '/all/login'; }} className="w-full bg-[#F20C8F] hover:bg-[#d10b7a] text-white font-medium py-2.5 sm:py-3 px-6 sm:px-8 rounded-md transition-colors duration-200 text-base sm:text-base cursor-pointer">Go to Login</button>
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