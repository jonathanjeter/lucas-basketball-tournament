// Validation utility functions

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateUSPhone = (phone: string): boolean => {
  // US phone format validation: (XXX) XXX-XXXX or (XXX)-XXX-XXXX or XXX-XXX-XXXX or XXXXXXXXXX
  const phoneRegex = /^(\(?\d{3}\)?[\s\-]?)?\d{3}[\s\-]?\d{4}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
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