// Common validation patterns and utilities

export const validationPatterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[\+]?[\d\s\-\(\)]+$/,
};

export interface ValidationError {
  [key: string]: string;
}

export interface FeedbackFormData {
  name: string;
  contact: string;
  diningTime: string;
  rating: number;
  content: string;
}

export function validateFeedbackForm(formData: FeedbackFormData): ValidationError {
  const errors: ValidationError = {};

  // Validate required content
  if (!formData.content.trim()) {
    errors.content = "Feedback is required";
  } else if (formData.content.trim().length < 10) {
    errors.content = "Feedback must be at least 10 characters";
  }

  // Validate optional contact
  if (formData.contact && formData.contact.trim()) {
    if (!validationPatterns.email.test(formData.contact) && !validationPatterns.phone.test(formData.contact)) {
      errors.contact = "Please enter a valid email or phone number";
    }
  }

  // Validate rating
  if (formData.rating < 1 || formData.rating > 5) {
    errors.rating = "Rating must be between 1 and 5";
  }

  return errors;
}

export function hasValidationErrors(errors: ValidationError): boolean {
  return Object.keys(errors).length > 0;
}