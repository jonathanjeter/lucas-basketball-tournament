import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { motion } from 'framer-motion';
import { Plus, Minus, Users, User, Shield } from 'lucide-react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Card } from './ui/Card';
import { registerTeam } from '../lib/supabase';
import { validateEmail, validateUSPhone, validateEmailOrPhone } from '../utils/validation';
import toast from 'react-hot-toast';

const playerSchema = z.object({
  name: z.string().min(1, 'Player name is required'),
  email: z.string().email('Valid email is required').optional(),
  contactPhone: z.string().optional(),
  gradeLevel: z.enum(['6th', '7th', '8th', '9th-12th', 'adult']),
  ageCategory: z.enum(['middle-school', 'high-school-adult']),
  birthdate: z.string().min(1, 'Birthdate is required'),
  emergencyContactName: z.string().min(1, 'Emergency contact name is required'),
  emergencyContactPhone: z.string().min(1, 'Emergency contact phone is required'),
  medicalInfo: z.string().optional(),
  parentConsent: z.boolean().optional(),
}).refine((data) => {
  // Either email or phone must be provided
  return data.email || data.contactPhone;
}, {
  message: 'Either email or phone number is required',
  path: ['email'],
});

const registrationSchema = z.object({
  registrationType: z.enum(['full-team', 'partial-team', 'individual']),
  teamName: z.string().optional(),
  players: z.array(playerSchema).min(1, 'At least one player is required'),
  paymentOption: z.enum(['suggested', 'different', 'later']).default('suggested'),
  customAmount: z.number().min(0).optional(),
  // Parental consent fields (only required if has minors)
  parentName: z.string().optional(),
  parentEmail: z.string().email().optional(),
  parentPhone: z.string().optional(),
  parentalConsent: z.boolean().optional(),
  medicalTreatmentConsent: z.boolean().optional(),
  liabilityWaiverAccepted: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the liability waiver and BSA guidelines to register',
  }),
}).refine((data) => {
  // Check if any players are actually minors (not adults)
  const hasMinors = data.players.some(player => {
    // Skip validation for adult players
    if (player.gradeLevel === 'adult' || player.ageCategory === 'high-school-adult') {
      return false;
    }
    
    // Check birthdate for other grade levels
    if (!player.birthdate) return false;
    const birthDate = new Date(player.birthdate);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return (age - 1) < 18;
    }
    return age < 18;
  });

  if (hasMinors) {
    // Only require parental consent fields if there are actual minors
    return data.parentName && data.parentEmail && data.parentPhone && 
           data.parentalConsent === true && data.medicalTreatmentConsent === true;
  }
  
  return true;
}, {
  message: 'Parental consent and contact information required for participants under 18',
  path: ['parentName'],
});

type RegistrationFormData = z.infer<typeof registrationSchema>;

export const RegistrationForm: React.FC = () => {
  const [step, setStep] = React.useState(1);
  const [stepJustChanged, setStepJustChanged] = React.useState(false);
  
  // Debug logging for component mount
  React.useEffect(() => {
    console.log('RegistrationForm component mounted');
    console.log('Initial step:', step);
    return () => console.log('RegistrationForm component unmounted');
  }, []);
  
  // Debug logging for step changes
  React.useEffect(() => {
    console.log('Registration form step changed to:', step);
    if (step === 2) {
      console.log('Step 2 loaded - setting step protection');
      setStepJustChanged(true);
      // Allow user interactions after a short delay
      const timer = setTimeout(() => {
        setStepJustChanged(false);
        console.log('Step 2 protection disabled - user can now interact');
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [step]);
  const [loading, setLoading] = React.useState(false);
  const [hasMinors, setHasMinors] = React.useState(false);
  const [customErrors, setCustomErrors] = React.useState<{[key: string]: string}>({});
  const [touchedFields, setTouchedFields] = React.useState<{[key: string]: boolean}>({});
  const { executeRecaptcha } = useGoogleReCaptcha();
  
  const { control, register, handleSubmit, watch, setValue, formState: { errors, isValid } } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      registrationType: 'individual',
      players: [{ 
        name: '', 
        email: '', 
        contactPhone: '',
        gradeLevel: '9th-12th',
        ageCategory: 'high-school-adult', 
        birthdate: '',
        emergencyContactName: '',
        emergencyContactPhone: '',
        medicalInfo: '',
        parentConsent: false 
      }],
      paymentOption: 'suggested',
      customAmount: 0,
      parentName: '',
      parentEmail: '',
      parentPhone: '',
      parentalConsent: false,
      medicalTreatmentConsent: false,
      liabilityWaiverAccepted: false,
    },
  });

  const { fields, append, remove, clearErrors } = useFieldArray({
    control,
    name: 'players',
  });

  const registrationType = watch('registrationType');
  const paymentOption = watch('paymentOption');
  const players = watch('players');

  // Debug logging for registration type changes
  React.useEffect(() => {
    console.log('Registration type changed to:', registrationType);
  }, [registrationType]);

  const addPlayer = () => {
    append({ 
      name: '', 
      email: '', 
      contactPhone: '',
      gradeLevel: '9th-12th',
      ageCategory: 'high-school-adult', 
      birthdate: '',
      emergencyContactName: '',
      emergencyContactPhone: '',
      medicalInfo: '',
      parentConsent: false 
    });
  };

  const removePlayer = (index: number) => {
    remove(index);
  };

  const checkForMinors = React.useCallback(() => {
    const currentPlayers = watch('players');
    const hasMinorPlayers = currentPlayers.some(player => {
      // Skip checking for adult players
      if (player.gradeLevel === 'adult' || player.ageCategory === 'high-school-adult') {
        return false;
      }
      
      if (!player.birthdate) return false;
      const birthDate = new Date(player.birthdate);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        return (age - 1) < 18;
      }
      return age < 18;
    });
    setHasMinors(hasMinorPlayers);
  }, [watch]);

  // Check for minors when players change
  React.useEffect(() => {
    checkForMinors();
  }, [players, checkForMinors]);

  // Validate individual field on blur
  const validateField = (fieldName: string, value: string) => {
    const newErrors = { ...customErrors };
    
    // Clear existing error for this field
    delete newErrors[fieldName];
    
    // Field-specific validation
    if (fieldName.includes('name') && !value.trim()) {
      newErrors[fieldName] = 'This field is required';
    } else if (fieldName.includes('birthdate') && !value) {
      newErrors[fieldName] = 'Birthdate is required';
    } else if (fieldName.includes('emergencyContactName') && !value.trim()) {
      newErrors[fieldName] = 'Emergency contact name is required';
    } else if (fieldName.includes('emergencyContactPhone')) {
      if (!value.trim()) {
        newErrors[fieldName] = 'Emergency phone is required';
      } else if (!validateUSPhone(value)) {
        newErrors[fieldName] = 'Please enter a valid US phone number';
      }
    } else if (fieldName.includes('email') && value && !validateEmail(value)) {
      newErrors[fieldName] = 'Please enter a valid email address';
    } else if (fieldName.includes('contactPhone') && value && !validateUSPhone(value)) {
      newErrors[fieldName] = 'Please enter a valid US phone number';
    }
    
    setCustomErrors(newErrors);
  };

  // Handle field blur events
  const handleFieldBlur = (fieldName: string, value: string, playerIndex: number) => {
    setTouchedFields(prev => ({ ...prev, [fieldName]: true }));
    validateField(fieldName, value);
    
    // Special handling for email/phone requirement
    if (fieldName.includes('email') || fieldName.includes('contactPhone')) {
      const currentPlayer = players[playerIndex];
      const email = fieldName.includes('email') ? value : currentPlayer?.email;
      const phone = fieldName.includes('contactPhone') ? value : currentPlayer?.contactPhone;
      
      const newErrors = { ...customErrors };
      const contactErrorKey = `players.${playerIndex}.contact`;
      delete newErrors[contactErrorKey];
      
      const emailPhoneValidation = validateEmailOrPhone(email || '', phone || '');
      if (!emailPhoneValidation.isValid) {
        if (!email && !phone) {
          newErrors[contactErrorKey] = 'Either email or phone is required';
        }
      }
      
      setCustomErrors(newErrors);
    }
  };

  // Check if form is valid for submission
  const isFormValid = () => {
    console.log('Checking form validity with players:', players);
    // Check all required fields are filled and valid
    for (let index = 0; index < players.length; index++) {
      const player = players[index];
      
      // Required fields check
      console.log(`Player ${index}:`, player);
      if (!player.name?.trim() || !player.birthdate || !player.emergencyContactName?.trim() || !player.emergencyContactPhone?.trim()) {
        console.log(`Player ${index} failed required fields check`);
        return false;
      }
      
      // Email OR phone requirement
      if (!validateEmailOrPhone(player.email || '', player.contactPhone || '').isValid) {
        return false;
      }
      
      // Valid format check
      if (player.emergencyContactPhone && !validateUSPhone(player.emergencyContactPhone)) {
        return false;
      }
      if (player.email && !validateEmail(player.email)) {
        return false;
      }
      if (player.contactPhone && !validateUSPhone(player.contactPhone)) {
        return false;
      }
    }
    
    console.log('Form is valid, returning true');
    return true;
  };

  // Handle Continue to Donation button click
  const handleContinueToPayment = (e: React.FormEvent) => {
    console.log('handleContinueToPayment called');
    e.preventDefault();
    
    if (!isFormValid()) {
      // Run full validation to show all errors
      const allErrors: {[key: string]: string} = {};
      
      players.forEach((player, index) => {
        const prefix = `players.${index}`;
        
        if (!player.name?.trim()) allErrors[`${prefix}.name`] = 'Player name is required';
        if (!player.birthdate) allErrors[`${prefix}.birthdate`] = 'Birthdate is required';
        if (!player.emergencyContactName?.trim()) allErrors[`${prefix}.emergencyContactName`] = 'Emergency contact required';
        if (!player.emergencyContactPhone?.trim()) allErrors[`${prefix}.emergencyContactPhone`] = 'Emergency phone required';
        
        if (!validateEmailOrPhone(player.email || '', player.contactPhone || '').isValid) {
          allErrors[`${prefix}.contact`] = 'Either email or phone is required';
        }
      });
      
      setCustomErrors(allErrors);
      
      // Scroll to first error for better UX
      setTimeout(() => {
        const firstErrorElement = document.querySelector('.border-red-500');
        if (firstErrorElement) {
          firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
      
      toast.error('Please fix all validation errors before continuing');
      return;
    }
    
    // Clear any previous custom errors and proceed
    setCustomErrors({});
    setStep(3);
  };

  const onSubmit = async (data: RegistrationFormData) => {
    console.log('🚀 onSubmit function called!');
    setLoading(true);
    console.log('Form submission started with data:', data);
    
    try {
      // Execute reCAPTCHA v3
      let recaptchaToken = null;
      if (executeRecaptcha) {
        try {
          recaptchaToken = await executeRecaptcha('registration');
          console.log('reCAPTCHA v3 token:', recaptchaToken);
        } catch (recaptchaError) {
          console.warn('reCAPTCHA failed, continuing without token:', recaptchaError);
        }
      }
      
      // Set donation amount to 0 since payment happens at tournament
      let donationAmount = 0;
      if (data.paymentOption === 'suggested') {
        donationAmount = data.players.length * 20;
      } else if (data.paymentOption === 'different') {
        donationAmount = data.customAmount || 0;
      }
      
      const submissionData = {
        registrationType: data.registrationType,
        teamName: data.teamName,
        players: data.players,
        donationAmount: donationAmount,
        recaptchaToken: recaptchaToken
      };
      
      console.log('Final submission data:', submissionData);
      const result = await registerTeam(submissionData);
      
      // Generate registration ID for confirmation
      const registrationId = `REG-${Date.now().toString().slice(-6)}`;
      
      toast.success(`Thank you! Your registration has been submitted for review. Registration ID: ${registrationId}. You'll receive updates on your application status.`);
      
      setTimeout(() => {
        window.location.reload();
      }, 5000);
      
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast.error(`Registration failed: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const maxPlayers = registrationType === 'full-team' ? 4 : registrationType === 'partial-team' ? 3 : 1;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Tournament Registration
        </h1>
        <p className="text-xl text-gray-600">
          Register for the 3-on-3 Basketball Tournament and support our Eagle Scout project!
        </p>
      </div>

      <Card className="p-8">
        <form onSubmit={(e) => {
          console.log('📝 Form submit event triggered');
          console.log('Form errors:', errors);
          console.log('Form isValid:', isValid);
          
          e.preventDefault(); // Always prevent default submission
          
          console.log('🔍 Final validation debug:', {
            playersLength: players.length,
            playersValid: players.map(p => ({
              name: !!p.name,
              email: !!p.email,
              phone: !!p.contactPhone,
              hasAllRequired: !!(p.name && p.email && p.contactPhone)
            })),
            allPlayersValid: players.every(p => p.name && p.email && p.contactPhone),
            formErrorsEmpty: Object.keys(errors).length === 0,
            whatIsIsValid: typeof isValid,
            isValidValue: isValid
          });
          
          // Use our custom validation instead of React Hook Form's isValid
          if (!isFormValid()) {
            console.log('❌ Custom validation failed - not submitting');
            toast.error('Please complete all required fields');
            return;
          }
          
          // Check liability waiver
          const liabilityAccepted = watch('liabilityWaiverAccepted');
          if (!liabilityAccepted) {
            console.log('❌ Liability waiver not accepted');
            toast.error('You must agree to the liability waiver to register');
            return;
          }
          
          console.log('✅ All validation passed - calling onSubmit directly');
          
          // Call onSubmit directly with current form values
          const currentData = {
            registrationType,
            teamName: watch('teamName') || '',
            players: players,
            paymentOption,
            customAmount: watch('customAmount') || 0,
            parentName: watch('parentName') || '',
            parentEmail: watch('parentEmail') || '',
            parentPhone: watch('parentPhone') || '',
            parentalConsent: watch('parentalConsent') || false,
            medicalTreatmentConsent: watch('medicalTreatmentConsent') || false,
            liabilityWaiverAccepted: liabilityAccepted
          };
          
          onSubmit(currentData);
        }} className="space-y-8">
          {/* Step 1: Registration Type */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                  Choose Registration Type
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { 
                      value: 'full-team', 
                      label: 'Full Team', 
                      description: '4 players (3 + 1 substitute)',
                      icon: Users 
                    },
                    { 
                      value: 'partial-team', 
                      label: 'Partial Team', 
                      description: '2-3 players (we\'ll help match)',
                      icon: Users 
                    },
                    { 
                      value: 'individual', 
                      label: 'Individual', 
                      description: 'Just yourself (we\'ll find teammates)',
                      icon: User 
                    },
                  ].map((option) => (
                    <label 
                      key={option.value} 
                      className="cursor-pointer"
                      onClick={() => {
                        console.log('Label clicked for:', option.value);
                      }}
                    >
                      <input
                        type="radio"
                        value={option.value}
                        {...register('registrationType')}
                        className="sr-only"
                        onClick={() => {
                          console.log('Radio button clicked:', option.value);
                          console.log('Current registrationType:', registrationType);
                        }}
                        onChange={(e) => {
                          console.log('Radio button changed:', e.target.value);
                          register('registrationType').onChange(e);
                        }}
                      />
                      <div className={`border-2 rounded-lg p-6 transition-all ${
                        registrationType === option.value 
                          ? 'border-orange-500 bg-orange-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}>
                        <option.icon className={`h-8 w-8 mx-auto mb-3 ${
                          registrationType === option.value ? 'text-orange-500' : 'text-gray-400'
                        }`} />
                        <div className="text-center">
                          <h3 className="font-semibold text-gray-900">{option.label}</h3>
                          <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-center mb-4">
                <Input
                  label="Team Name (Optional)"
                  placeholder="Enter team name (optional)"
                  {...register('teamName')}
                  helper="Leave blank for individual registration"
                />
              </div>

              <Button 
                type="button" 
                onClick={() => {
                  console.log('Continue button clicked, current step:', step);
                  console.log('Current registration type:', registrationType);
                  console.log('Moving to step 2');
                  setStep(2);
                }} 
                className="w-full md:w-auto"
              >
                Continue to Player Details
              </Button>
            </motion.div>
          )}

          {/* Step 2: Player Details */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-gray-900">
                  Player Information
                </h2>
                {fields.length < maxPlayers && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addPlayer}
                    className="flex items-center space-x-2"
                  >
                    <Plus size={16} />
                    <span>Add Player</span>
                  </Button>
                )}
              </div>

              {fields.map((field, index) => (
                <Card key={field.id} className="p-6 relative">
                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removePlayer(index)}
                      className="absolute top-4 right-4 text-red-500 hover:text-red-700"
                    >
                      <Minus size={20} />
                    </button>
                  )}
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Player {index + 1}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Full Name"
                      placeholder="Enter player's full name"
                      {...register(`players.${index}.name`, {
                        onBlur: (e) => handleFieldBlur(`players.${index}.name`, e.target.value, index)
                      })}
                      error={errors.players?.[index]?.name?.message || customErrors[`players.${index}.name`]}
                      required
                    />
                    
                    <Input
                      label="Email Address"
                      type="email"
                      placeholder="Enter email address"
                      {...register(`players.${index}.email`, {
                        onBlur: (e) => handleFieldBlur(`players.${index}.email`, e.target.value, index)
                      })}
                      error={errors.players?.[index]?.email?.message || customErrors[`players.${index}.email`] || customErrors[`players.${index}.contact`]}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <Input
                      label="Phone Number (if no email provided)"
                      type="tel"
                      placeholder="(XXX) XXX-XXXX"
                      {...register(`players.${index}.contactPhone`, {
                        onBlur: (e) => handleFieldBlur(`players.${index}.contactPhone`, e.target.value, index)
                      })}
                      error={errors.players?.[index]?.contactPhone?.message || customErrors[`players.${index}.contactPhone`] || customErrors[`players.${index}.contact`]}
                    />
                    
                    <Input
                      label="Birthdate"
                      type="date"
                      {...register(`players.${index}.birthdate`, {
                        onBlur: (e) => handleFieldBlur(`players.${index}.birthdate`, e.target.value, index)
                      })}
                      error={errors.players?.[index]?.birthdate?.message || customErrors[`players.${index}.birthdate`]}
                      max={new Date().toISOString().split('T')[0]}
                      onChange={(e) => {
                        setValue(`players.${index}.birthdate`, e.target.value);
                        checkForMinors();
                      }}
                      required
                    />
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Grade Level *
                    </label>
                    <select
                      {...register(`players.${index}.gradeLevel`)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      onChange={(e) => {
                        const gradeLevel = e.target.value;
                        setValue(`players.${index}.gradeLevel`, gradeLevel as any);
                        // Auto-assign age category based on grade level
                        if (gradeLevel === '6th' || gradeLevel === '7th' || gradeLevel === '8th') {
                          setValue(`players.${index}.ageCategory`, 'middle-school');
                        } else {
                          setValue(`players.${index}.ageCategory`, 'high-school-adult');
                        }
                      }}
                      required
                    >
                      <option value="">Select grade level</option>
                      <option value="6th">6th Grade</option>
                      <option value="7th">7th Grade</option>
                      <option value="8th">8th Grade</option>
                      <option value="9th-12th">9th-12th Grade (High School)</option>
                      <option value="adult">Adult (18+)</option>
                    </select>
                    {errors.players?.[index]?.gradeLevel && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.players?.[index]?.gradeLevel?.message}
                      </p>
                    )}
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Division Assignment (Auto-assigned) *
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`border-2 rounded-lg p-4 transition-all ${
                        players[index]?.ageCategory === 'middle-school'
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200'
                      }`}>
                        <h4 className="font-semibold flex items-center">
                          {players[index]?.ageCategory === 'middle-school' && <span className="text-blue-600 mr-2">✓</span>}
                          Junior Division
                        </h4>
                        <p className="text-sm text-gray-600">6th-8th Grade Players</p>
                        <p className="text-xs text-gray-500 mt-1">Auto-assigned based on grade level</p>
                      </div>
                      
                      <div className={`border-2 rounded-lg p-4 transition-all ${
                        players[index]?.ageCategory === 'high-school-adult'
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200'
                      }`}>
                        <h4 className="font-semibold flex items-center">
                          {players[index]?.ageCategory === 'high-school-adult' && <span className="text-purple-600 mr-2">✓</span>}
                          Senior Division
                        </h4>
                        <p className="text-sm text-gray-600">9th-12th Grade & Adult Players</p>
                        <p className="text-xs text-gray-500 mt-1">Auto-assigned based on grade level</p>
                      </div>
                    </div>

                    {/* Hidden input to maintain form state */}
                    <input 
                      type="hidden" 
                      {...register(`players.${index}.ageCategory`)} 
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <Input
                      label="Emergency Contact Name"
                      placeholder="Emergency contact name"
                      {...register(`players.${index}.emergencyContactName`, {
                        onBlur: (e) => handleFieldBlur(`players.${index}.emergencyContactName`, e.target.value, index)
                      })}
                      error={errors.players?.[index]?.emergencyContactName?.message || customErrors[`players.${index}.emergencyContactName`]}
                      required
                    />
                    <Input
                      label="Emergency Phone"
                      type="tel"
                      placeholder="(XXX) XXX-XXXX"
                      {...register(`players.${index}.emergencyContactPhone`, {
                        onBlur: (e) => handleFieldBlur(`players.${index}.emergencyContactPhone`, e.target.value, index)
                      })}
                      error={errors.players?.[index]?.emergencyContactPhone?.message || customErrors[`players.${index}.emergencyContactPhone`]}
                      required
                    />
                  </div>
                  
                  <div className="mt-4">
                    <label htmlFor={`player${index}Medical`} className="block text-sm font-medium text-gray-700 mb-2">
                      Medical Conditions/Allergies (optional)
                    </label>
                    <textarea
                      id={`player${index}Medical`}
                      {...register(`players.${index}.medicalInfo`)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      rows={2}
                      placeholder="Any medical conditions, allergies, or medications we should know about"
                    />
                  </div>

                  {players[index]?.ageCategory === 'middle-school' && (
                    <div className="mt-4">
                      <label className="flex items-start space-x-3">
                        <input
                          type="checkbox"
                          {...register(`players.${index}.parentConsent`)}
                          className="mt-1 h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                        />
                        <span className="text-sm text-gray-700">
                          <strong>Parent/Guardian Consent:</strong> I give permission for this minor to participate in the 3-on-3 basketball tournament. I understand the risks involved and agree to the terms and conditions.
                        </span>
                      </label>
                      {errors.players?.[index]?.parentConsent && (
                        <p className="mt-1 text-sm text-red-600">
                          Parent/guardian consent is required for middle school players
                        </p>
                      )}
                    </div>
                  )}
                </Card>
              ))}

              <div className="flex space-x-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setStep(1)}
                >
                  Back
                </Button>
                <button
                  type="button"
                  onClick={(e) => {
                    if (stepJustChanged) {
                      console.log('Button click blocked - step just changed, likely auto-click');
                      e.preventDefault();
                      e.stopPropagation();
                      return;
                    }
                    console.log('Button clicked - calling handleContinueToPayment');
                    handleContinueToPayment(e);
                  }}
                  className="w-full bg-orange-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-orange-700 min-h-[44px]"
                >
                  Continue to Donation
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Donation */}
          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="text-center">
                <Shield className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Tournament Payment Options
                </h2>
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-semibold text-green-900 mb-2">
                    💚 No One Excluded for Financial Reasons
                  </h3>
                  <p className="text-green-800">
                    Our Eagle Scout project welcomes everyone! The $20 suggested donation helps fund our cemetery restoration, 
                    but financial hardship should never prevent participation. Choose the option that works best for you.
                  </p>
                </div>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800 text-sm">
                  <strong>Note:</strong> Your registration will be reviewed and approved within 24 hours. 
                  You'll receive confirmation once approved.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Select Your Payment Option
                </h3>
                
                <div className="grid grid-cols-1 gap-4">
                  <label className="cursor-pointer">
                    <input
                      type="radio"
                      value="suggested"
                      {...register('paymentOption')}
                      className="sr-only"
                    />
                    <div className={`border-2 rounded-lg p-4 transition-all ${
                      paymentOption === 'suggested'
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-semibold text-green-900">Pay Suggested Amount</h4>
                          <p className="text-sm text-green-700">$20 per player at tournament (${players.length * 20} total)</p>
                        </div>
                        <div className="text-2xl font-bold text-green-600">
                          ${players.length * 20}
                        </div>
                      </div>
                    </div>
                  </label>
              
                  <label className="cursor-pointer">
                    <input
                      type="radio"
                      value="different"
                      {...register('paymentOption')}
                      className="sr-only"
                    />
                    <div className={`border-2 rounded-lg p-4 transition-all ${
                      paymentOption === 'different'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      <h4 className="font-semibold text-blue-900">Pay Different Amount</h4>
                      <p className="text-sm text-blue-700">Choose your own amount at tournament</p>
                    </div>
                  </label>

                  {paymentOption === 'different' && (
                    <Input
                      type="number"
                      label="Planned Amount"
                      placeholder="Enter planned amount (optional)"
                      min="0"
                      step="1"
                      {...register('customAmount', { valueAsNumber: true })}
                      helper="Optional: helps us prepare, but you can change at tournament"
                    />
                  )}

                  <label className="cursor-pointer">
                    <input
                      type="radio"
                      value="later"
                      {...register('paymentOption')}
                      className="sr-only"
                    />
                    <div className={`border-2 rounded-lg p-4 transition-all ${
                      paymentOption === 'later'
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      <h4 className="font-semibold text-orange-900">Pay Later</h4>
                      <p className="text-sm text-orange-700">Decide donation amount at the tournament</p>
                    </div>
                  </label>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="text-blue-800 space-y-2">
                    <p><strong>📍 Location:</strong> Finley Junior High School Gym<br />
                    2401 Brown St, Waxahachie, TX 75165</p>
                    <p><strong>🕖 Schedule:</strong> Check-in starts 7:30 AM, games begin 8:00 AM</p>
                    <p><strong>💰 Payment:</strong> All donations collected at tournament check-in</p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-900 mb-2">What Your Donation Supports:</h4>
                <ul className="text-green-800 text-sm space-y-1">
                  <li>• Eagle Scout cemetery restoration project</li>
                  <li>• Cleaning supplies for veteran headstones</li>
                  <li>• Community service and historical preservation</li>
                </ul>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg border border-green-200 mt-4">
                <p className="text-green-800 font-medium">
                  Funds raised above our $400 goal will be donated to the Sons of American Revolution 
                  to support their mission of preserving American history and honoring our founding fathers.
                </p>
              </div>
              
              {/* PARENTAL CONSENT SECTION */}
              {hasMinors && (
                <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 mb-6">
                  <h3 className="font-semibold text-blue-800 mb-4">Parental Consent Required</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <Input
                      label="Parent/Guardian Name"
                      {...register('parentName')}
                      error={errors.parentName?.message}
                      required={hasMinors}
                    />
                    <Input
                      label="Parent/Guardian Email"
                      type="email"
                      {...register('parentEmail')}
                      error={errors.parentEmail?.message}
                      required={hasMinors}
                    />
                    <Input
                      label="Parent/Guardian Phone"
                      type="tel"
                      {...register('parentPhone')}
                      error={errors.parentPhone?.message}
                      required={hasMinors}
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="flex items-start space-x-2">
                      <input 
                        type="checkbox" 
                        {...register('parentalConsent')}
                        className="mt-1" 
                        required={hasMinors}
                      />
                      <span className="text-sm">
                        I consent to my child's participation in this BSA-approved tournament and agree to the 
                        <a href="/liability-waiver" className="text-blue-600 underline mx-1">liability waiver</a> 
                        and BSA Youth Protection guidelines.
                      </span>
                    </label>
                    <label className="flex items-start space-x-2">
                      <input 
                        type="checkbox" 
                        {...register('medicalTreatmentConsent')}
                        className="mt-1" 
                        required={hasMinors}
                      />
                      <span className="text-sm">
                        I authorize tournament officials to seek emergency medical treatment if needed.
                      </span>
                    </label>
                    {errors.parentName && (
                      <p className="text-red-600 text-sm mt-2">{errors.parentName.message}</p>
                    )}
                  </div>
                </div>
              )}
              
              {/* LIABILITY WAIVER FOR ALL PARTICIPANTS */}
              <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
                <h3 className="font-semibold text-yellow-800 mb-3">Liability Waiver & Tournament Agreement</h3>
                <div className="space-y-3 text-sm text-gray-700">
                  <p>By registering, all participants agree to:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Participate at their own risk in this sports activity</li>
                    <li>Follow all tournament rules and sportsmanship guidelines</li>
                    <li>BSA Youth Protection policies and Scout Oath and Law</li>
                    <li>Photography/video consent for promotional use</li>
                  </ul>
                  <label className="flex items-start space-x-2 mt-4">
                    <input 
                      type="checkbox" 
                      {...register('liabilityWaiverAccepted')}
                      className="mt-1" 
                      required
                    />
                    <span className="font-medium">
                      I agree to the <a href="/liability-waiver" className="text-blue-600 underline">complete liability waiver</a> 
                      and tournament terms. This is a BSA Troop 232 approved fundraising event.
                    </span>
                  </label>
                  {errors.liabilityWaiverAccepted && (
                    <p className="text-red-600 text-sm mt-2">{errors.liabilityWaiverAccepted.message}</p>
                  )}
                </div>
              </div>

              <div className="flex space-x-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setStep(2)}
                >
                  Back
                </Button>
                <Button 
                  type="submit" 
                  loading={loading}
                  className="flex-1"
                  onClick={(e) => {
                    console.log('🎯 Submit Registration button clicked');
                    console.log('Button event:', e);
                    // Don't prevent default - let form submission proceed
                  }}
                >
                  Submit Registration for Review
                </Button>
              </div>
            </motion.div>
          )}
        </form>
      </Card>
    </div>
  );
};