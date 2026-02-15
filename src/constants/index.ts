/**
 * Application Constants
 * Centralized configuration values used throughout the app
 */

// Contact Information
export const CONTACT = {
  PHONE: '+998781133883',
  PHONE_FORMATTED: '+998 (78) 113-38-83',
  PHONE_DISPLAY: '+998(78)113-38-83',
} as const;

// External Links
export const SOCIAL_LINKS = {
  INSTAGRAM: '#',
  FACEBOOK: '#',
  YOUTUBE: '#',
  TELEGRAM: '#',
} as const;

// App Configuration
export const APP_CONFIG = {
  NAME: 'Otolor',
  DEFAULT_LANGUAGE: 'uz',
  SUPPORTED_LANGUAGES: ['uz', 'ru', 'en'] as const,
} as const;

// API Configuration
export const API_CONFIG = {
  TIMEOUT: 15000,
  STALE_TIME: 5 * 60 * 1000, // 5 minutes
} as const;
