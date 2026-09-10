export interface Country {
  name: string;
  code: string;
  dialCode: string;
  flag: string;
  minLength: number;
  maxLength: number;
  placeholder: string;
}

export function getCountryFlagUrl(countryCode: string): string {
  return `https://flagcdn.com/w40/${countryCode.toLowerCase()}.png`;
}

export const COUNTRIES: Country[] = [
  { name: 'India', code: 'IN', dialCode: '+91', flag: '🇮🇳', minLength: 10, maxLength: 10, placeholder: '' },
  { name: 'United Arab Emirates', code: 'AE', dialCode: '+971', flag: '🇦🇪', minLength: 9, maxLength: 9, placeholder: '' },
  { name: 'United States', code: 'US', dialCode: '+1', flag: '🇺🇸', minLength: 10, maxLength: 10, placeholder: '' },
  { name: 'United Kingdom', code: 'GB', dialCode: '+44', flag: '🇬🇧', minLength: 10, maxLength: 10, placeholder: '' },
  { name: 'Saudi Arabia', code: 'SA', dialCode: '+966', flag: '🇸🇦', minLength: 9, maxLength: 9, placeholder: '' },
  { name: 'Singapore', code: 'SG', dialCode: '+65', flag: '🇸🇬', minLength: 8, maxLength: 8, placeholder: '' },
  { name: 'Malaysia', code: 'MY', dialCode: '+60', flag: '🇲🇾', minLength: 9, maxLength: 10, placeholder: '' },
  { name: 'Qatar', code: 'QA', dialCode: '+974', flag: '🇶🇦', minLength: 8, maxLength: 8, placeholder: '' },
  { name: 'Kuwait', code: 'KW', dialCode: '+965', flag: '🇰🇼', minLength: 8, maxLength: 8, placeholder: '' },
  { name: 'Oman', code: 'OM', dialCode: '+968', flag: '🇴🇲', minLength: 8, maxLength: 8, placeholder: '' },
  { name: 'Bahrain', code: 'BH', dialCode: '+973', flag: '🇧🇭', minLength: 8, maxLength: 8, placeholder: '' },
  { name: 'Australia', code: 'AU', dialCode: '+61', flag: '🇦🇺', minLength: 9, maxLength: 9, placeholder: '' },
  { name: 'Canada', code: 'CA', dialCode: '+1', flag: '🇨🇦', minLength: 10, maxLength: 10, placeholder: '' },
  { name: 'Germany', code: 'DE', dialCode: '+49', flag: '🇩🇪', minLength: 10, maxLength: 11, placeholder: '' },
  { name: 'France', code: 'FR', dialCode: '+33', flag: '🇫🇷', minLength: 9, maxLength: 9, placeholder: '' },
  { name: 'New Zealand', code: 'NZ', dialCode: '+64', flag: '🇳🇿', minLength: 9, maxLength: 10, placeholder: '' },
  { name: 'South Africa', code: 'ZA', dialCode: '+27', flag: '🇿🇦', minLength: 9, maxLength: 9, placeholder: '' },
  { name: 'Sri Lanka', code: 'LK', dialCode: '+94', flag: '🇱🇰', minLength: 9, maxLength: 9, placeholder: '' },
  { name: 'Bangladesh', code: 'BD', dialCode: '+880', flag: '🇧🇩', minLength: 10, maxLength: 10, placeholder: '' },
  { name: 'Nepal', code: 'NP', dialCode: '+977', flag: '🇳🇵', minLength: 10, maxLength: 10, placeholder: '' },
  { name: 'Philippines', code: 'PH', dialCode: '+63', flag: '🇵🇭', minLength: 10, maxLength: 10, placeholder: '' },
  { name: 'Indonesia', code: 'ID', dialCode: '+62', flag: '🇮🇩', minLength: 9, maxLength: 12, placeholder: '' },
  { name: 'Thailand', code: 'TH', dialCode: '+66', flag: '🇹🇭', minLength: 9, maxLength: 9, placeholder: '' },
  { name: 'Japan', code: 'JP', dialCode: '+81', flag: '🇯🇵', minLength: 10, maxLength: 10, placeholder: '' },
  { name: 'South Korea', code: 'KR', dialCode: '+82', flag: '🇰🇷', minLength: 9, maxLength: 10, placeholder: '' },
  { name: 'China', code: 'CN', dialCode: '+86', flag: '🇨🇳', minLength: 11, maxLength: 11, placeholder: '' },
  { name: 'Hong Kong', code: 'HK', dialCode: '+852', flag: '🇭🇰', minLength: 8, maxLength: 8, placeholder: '' },
  { name: 'Switzerland', code: 'CH', dialCode: '+41', flag: '🇨🇭', minLength: 9, maxLength: 9, placeholder: '' },
  { name: 'Netherlands', code: 'NL', dialCode: '+31', flag: '🇳🇱', minLength: 9, maxLength: 9, placeholder: '' },
  { name: 'Sweden', code: 'SE', dialCode: '+46', flag: '🇸🇪', minLength: 9, maxLength: 9, placeholder: '' },
  { name: 'Norway', code: 'NO', dialCode: '+47', flag: '🇳🇴', minLength: 8, maxLength: 8, placeholder: '' },
  { name: 'Denmark', code: 'DK', dialCode: '+45', flag: '🇩🇰', minLength: 8, maxLength: 8, placeholder: '' },
  { name: 'Italy', code: 'IT', dialCode: '+39', flag: '🇮🇹', minLength: 10, maxLength: 10, placeholder: '' },
  { name: 'Spain', code: 'ES', dialCode: '+34', flag: '🇪🇸', minLength: 9, maxLength: 9, placeholder: '' },
  { name: 'Ireland', code: 'IE', dialCode: '+353', flag: '🇮🇪', minLength: 9, maxLength: 9, placeholder: '' },
  { name: 'Belgium', code: 'BE', dialCode: '+32', flag: '🇧🇪', minLength: 9, maxLength: 9, placeholder: '' },
  { name: 'Austria', code: 'AT', dialCode: '+43', flag: '🇦🇹', minLength: 10, maxLength: 11, placeholder: '' },
  { name: 'Poland', code: 'PL', dialCode: '+48', flag: '🇵🇱', minLength: 9, maxLength: 9, placeholder: '' },
  { name: 'Portugal', code: 'PT', dialCode: '+351', flag: '🇵🇹', minLength: 9, maxLength: 9, placeholder: '' },
  { name: 'Greece', code: 'GR', dialCode: '+30', flag: '🇬🇷', minLength: 10, maxLength: 10, placeholder: '' },
  { name: 'Turkey', code: 'TR', dialCode: '+90', flag: '🇹🇷', minLength: 10, maxLength: 10, placeholder: '' },
  { name: 'Egypt', code: 'EG', dialCode: '+20', flag: '🇪🇬', minLength: 10, maxLength: 10, placeholder: '' },
  { name: 'Nigeria', code: 'NG', dialCode: '+234', flag: '🇳🇬', minLength: 10, maxLength: 10, placeholder: '' },
  { name: 'Kenya', code: 'KE', dialCode: '+254', flag: '🇰🇪', minLength: 9, maxLength: 9, placeholder: '' },
  { name: 'Brazil', code: 'BR', dialCode: '+55', flag: '🇧🇷', minLength: 10, maxLength: 11, placeholder: '' },
  { name: 'Mexico', code: 'MX', dialCode: '+52', flag: '🇲🇽', minLength: 10, maxLength: 10, placeholder: '' },
  { name: 'Argentina', code: 'AR', dialCode: '+54', flag: '🇦🇷', minLength: 10, maxLength: 10, placeholder: '' },
  { name: 'Chile', code: 'CL', dialCode: '+56', flag: '🇨🇱', minLength: 9, maxLength: 9, placeholder: '' },
  { name: 'Colombia', code: 'CO', dialCode: '+57', flag: '🇨🇴', minLength: 10, maxLength: 10, placeholder: '' },
  { name: 'Russia', code: 'RU', dialCode: '+7', flag: '🇷🇺', minLength: 10, maxLength: 10, placeholder: '' },
  { name: 'Vietnam', code: 'VN', dialCode: '+84', flag: '🇻🇳', minLength: 9, maxLength: 10, placeholder: '' },
  { name: 'Israel', code: 'IL', dialCode: '+972', flag: '🇮🇱', minLength: 9, maxLength: 9, placeholder: '' },
  { name: 'Mauritius', code: 'MU', dialCode: '+230', flag: '🇲🇺', minLength: 8, maxLength: 8, placeholder: '' },
  { name: 'Maldives', code: 'MV', dialCode: '+960', flag: '🇲🇻', minLength: 7, maxLength: 7, placeholder: '' },
  { name: 'Seychelles', code: 'SC', dialCode: '+248', flag: '🇸🇨', minLength: 7, maxLength: 7, placeholder: '' },
];

export const DEFAULT_COUNTRY: Country = COUNTRIES[0]; // India (+91)
