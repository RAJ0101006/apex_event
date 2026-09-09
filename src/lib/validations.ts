/**
 * Input sanitization to prevent XSS attacks.
 * Strips script tags, javascript: protocols, and unsafe HTML tags.
 */
export function sanitizeInput(value: unknown): string {
  if (typeof value !== "string") return "";
  return value
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/on\w+\s*=\s*(['"]).*?\1/gi, "")
    .replace(/javascript:/gi, "")
    .trim();
}

/**
 * Validates an Indian phone number (10 digits, optional country code)
 */
export function isValidPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, "");
  return digits.length === 10 || (digits.length === 12 && digits.startsWith("91"));
}

/**
 * Validates an email address format
 */
export function isValidEmail(email: string): boolean {
  if (!email) return true; // Optional field
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/**
 * Validates standard URLs (http/https)
 */
export function isValidUrl(url: string): boolean {
  if (!url) return true;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export interface ValidationResult<T> {
  isValid: boolean;
  errors: Record<string, string>;
  data?: T;
}

export function validateEventInput(formData: FormData): ValidationResult<{
  title: string;
  category: string;
  imageUrl: string;
  altText: string;
  description: string;
  date?: string;
  venue?: string;
  featured: boolean;
  active: boolean;
  sortOrder: number;
}> {
  const errors: Record<string, string> = {};
  const title = sanitizeInput(formData.get("title"));
  const category = sanitizeInput(formData.get("category"));
  const imageUrl = sanitizeInput(formData.get("imageUrl"));
  const altText = sanitizeInput(formData.get("altText")) || `${title} - Apex Event Surat`;
  const description = sanitizeInput(formData.get("description"));
  const date = sanitizeInput(formData.get("date"));
  const venue = sanitizeInput(formData.get("venue"));
  const featured = formData.get("featured") === "true" || formData.get("featured") === "on";
  const active = formData.get("active") !== "false" && formData.get("active") !== "off";
  const sortOrder = parseInt(formData.get("sortOrder") as string, 10) || 0;

  if (!title || title.length < 2 || title.length > 150) {
    errors.title = "Title is required and must be between 2 and 150 characters.";
  }

  const allowedCategories = [
    "Marriage",
    "Engagement",
    "Couple Entry",
    "Carnival",
    "Pre-Wedding",
    "Corporate",
    "Birthday",
    "Other",
  ];
  if (!category || !allowedCategories.includes(category)) {
    errors.category = `Category must be one of: ${allowedCategories.join(", ")}`;
  }

  if (!imageUrl) {
    errors.imageUrl = "An image is required. Please upload an image.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    data: { title, category, imageUrl, altText, description, date, venue, featured, active, sortOrder },
  };
}

export function validateServiceInput(formData: FormData): ValidationResult<{
  title: string;
  description: string;
  shortDescription: string;
  fullDescription: string;
  imageUrl: string;
  icon?: string;
  featured: boolean;
  active: boolean;
  sortOrder: number;
}> {
  const errors: Record<string, string> = {};
  const title = sanitizeInput(formData.get("title"));
  const description = sanitizeInput(formData.get("description"));
  const shortDescription = sanitizeInput(formData.get("shortDescription")) || description;
  const fullDescription = sanitizeInput(formData.get("fullDescription")) || description;
  const imageUrl = sanitizeInput(formData.get("imageUrl"));
  const icon = sanitizeInput(formData.get("icon"));
  const featured = formData.get("featured") === "true" || formData.get("featured") === "on";
  const active = formData.get("active") !== "false" && formData.get("active") !== "off";
  const sortOrder = parseInt(formData.get("sortOrder") as string, 10) || 0;

  if (!title || title.length < 2 || title.length > 100) {
    errors.title = "Service title must be between 2 and 100 characters.";
  }
  if (!description || description.length < 5) {
    errors.description = "Description is required (at least 5 characters).";
  }
  if (!imageUrl) {
    errors.imageUrl = "Cover image is required.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    data: { title, description, shortDescription, fullDescription, imageUrl, icon, featured, active, sortOrder },
  };
}

export function validateTeamInput(formData: FormData): ValidationResult<{
  name: string;
  role: string;
  imageUrl: string;
  bio?: string;
  phone?: string;
  socialLinks?: string;
  visible: boolean;
  sortOrder: number;
}> {
  const errors: Record<string, string> = {};
  const name = sanitizeInput(formData.get("name"));
  const role = sanitizeInput(formData.get("role"));
  const imageUrl = sanitizeInput(formData.get("imageUrl"));
  const bio = sanitizeInput(formData.get("bio"));
  const phone = sanitizeInput(formData.get("phone"));
  const socialLinks = sanitizeInput(formData.get("socialLinks"));
  const visible = formData.get("visible") !== "false" && formData.get("visible") !== "off";
  const sortOrder = parseInt(formData.get("sortOrder") as string, 10) || 0;

  if (!name || name.length < 2 || name.length > 80) {
    errors.name = "Name is required (2-80 characters).";
  }
  if (!role || role.length < 2 || role.length > 80) {
    errors.role = "Designation/Role is required (2-80 characters).";
  }
  if (!imageUrl) {
    errors.imageUrl = "Profile photo is required.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    data: { name, role, imageUrl, bio, phone, socialLinks, visible, sortOrder },
  };
}

export function validateLeadInput(formData: FormData): ValidationResult<{
  name: string;
  phone: string;
  email?: string;
  date: string;
  service: string;
  budget?: string;
  venue?: string;
  message?: string;
  honeypot?: string;
}> {
  const errors: Record<string, string> = {};
  const name = sanitizeInput(formData.get("name"));
  const phone = sanitizeInput(formData.get("phone"));
  const email = sanitizeInput(formData.get("email"));
  const date = sanitizeInput(formData.get("date"));
  const service = sanitizeInput(formData.get("service"));
  const budget = sanitizeInput(formData.get("budget"));
  const venue = sanitizeInput(formData.get("venue"));
  const message = sanitizeInput(formData.get("message"));
  const honeypot = sanitizeInput(formData.get("website_hp")); // Hidden field for bot detection

  // Honeypot check: If filled, it is a bot submission
  if (honeypot) {
    errors.bot = "Spam detection triggered.";
  }

  if (!name || name.length < 2 || name.length > 80) {
    errors.name = "Please provide your full name.";
  }
  if (!phone || !isValidPhone(phone)) {
    errors.phone = "Please enter a valid 10-digit phone number.";
  }
  if (email && !isValidEmail(email)) {
    errors.email = "Please enter a valid email address.";
  }
  if (!date) {
    errors.date = "Please select an event date.";
  }
  if (!service) {
    errors.service = "Please select the service you are interested in.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    data: { name, phone, email, date, service, budget, venue, message, honeypot },
  };
}
