// Validation utility functions

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateUSPhone = (phone: string): boolean => {
  // Remove all non-digit characters for validation
  const digitsOnly = phone.replace(/\D/g, '');
  
  // Must be 10 digits (US phone) or 11 digits (with country code 1)
  if (digitsOnly.length === 10) {
    return /^[2-9]\d{2}[2-9]\d{6}$/.test(digitsOnly); // Valid US area code and number
  } else if (digitsOnly.length === 11 && digitsOnly[0] === '1') {
    return /^1[2-9]\d{2}[2-9]\d{6}$/.test(digitsOnly); // With US country code
  }
  
  return false;
};

export const validateEmailOrPhone = (email: string, phone: string): { isValid: boolean; message?: string } => {
  const hasEmail = email && email.trim() !== '';
  const hasPhone = phone && phone.trim() !== '';
  
  if (!hasEmail && !hasPhone) {
    return { isValid: false, message: 'Either email or phone number is required' };
  }
  
  if (hasEmail && !validateEmail(email)) {
    return { isValid: false, message: 'Please enter a valid email address' };
  }
  
  if (hasPhone && !validateUSPhone(phone)) {
    return { isValid: false, message: 'Please enter a valid US phone number' };
  }
  
  return { isValid: true };
};