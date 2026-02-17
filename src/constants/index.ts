
export const CONTACT = {
  PHONE: '+998781133883',
  PHONE_FORMATTED: '+998 (78) 113-38-83',
  PHONE_DISPLAY: '+998(78)113-38-83',
} as const;

export const SOCIAL_LINKS = {
  INSTAGRAM: '#',
  FACEBOOK: '#',
  YOUTUBE: '#',
  TELEGRAM: '#',
} as const;

export const APP_CONFIG = {
  NAME: 'Otolor',
  DEFAULT_LANGUAGE: 'uz',
  SUPPORTED_LANGUAGES: ['uz', 'ru', 'en'] as const,
} as const;

export const API_CONFIG = {
  TIMEOUT: 15000,
  STALE_TIME: 5 * 60 * 1000, // 5 minutes
} as const;
