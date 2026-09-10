'use client';

import React, { useState, useRef, useEffect, useId } from 'react';
import { ChevronDown, Search, X, Check } from 'lucide-react';
import { Country, COUNTRIES, DEFAULT_COUNTRY } from '@/lib/countryCodes';
import { cleanPhone, isDummyPhoneNumber } from '@/lib/formValidation';

interface PhoneInputWithCountryProps {
  phone: string;
  selectedCountry: Country;
  onPhoneChange: (cleanedPhone: string) => void;
  onCountryChange: (country: Country) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  id?: string;
  name?: string;
  placeholder?: string;
  variant?: 'pill' | 'rounded';
  className?: string;
  onBlur?: () => void;
}

export function CountryFlagIcon({
  code,
  name,
  flag,
  className = 'h-3.5 w-5',
}: {
  code: string;
  name?: string;
  flag?: string;
  className?: string;
}) {
  const [imgFailed, setImgFailed] = useState(false);
  const lower = code.toLowerCase();

  if (imgFailed) {
    return flag ? (
      <span className="text-base leading-none" aria-hidden="true">
        {flag}
      </span>
    ) : (
      <span className="inline-flex items-center justify-center text-[10px] font-bold text-slate-700 bg-slate-200 rounded px-1 min-w-[20px] text-center">
        {code}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center justify-center shrink-0">
      <img
        src={`https://flagcdn.com/w40/${lower}.png`}
        srcSet={`https://flagcdn.com/w80/${lower}.png 2x`}
        alt={name ? `${name} flag` : code}
        width={20}
        height={14}
        loading="eager"
        decoding="async"
        onError={() => setImgFailed(true)}
        className={`${className} object-cover rounded-[2px] border border-slate-200/80 shadow-[0_1px_2px_rgba(0,0,0,0.06)] shrink-0`}
      />
    </span>
  );
}

export default function PhoneInputWithCountry({
  phone,
  selectedCountry = DEFAULT_COUNTRY,
  onPhoneChange,
  onCountryChange,
  error,
  required = false,
  disabled = false,
  id,
  name = 'phone',
  placeholder,
  variant = 'rounded',
  className = '',
  onBlur,
}: PhoneInputWithCountryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const autoId = useId();
  const inputId = id || autoId;

  // Filter countries by query (name or dialCode)
  const filteredCountries = COUNTRIES.filter((c) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      c.name.toLowerCase().includes(q) ||
      c.dialCode.includes(q) ||
      c.code.toLowerCase().includes(q)
    );
  });

  // Check space & focus search input when dropdown opens
  useEffect(() => {
    if (isOpen) {
      if (dropdownRef.current) {
        const rect = dropdownRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        if (spaceBelow < 280 && rect.top > 280) {
          setOpenUpward(true);
        } else {
          setOpenUpward(false);
        }
      }
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    } else {
      setSearchQuery('');
    }
  }, [isOpen]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const [touched, setTouched] = useState(false);

  // Compute live validation error in real time
  const liveError = React.useMemo(() => {
    // Parent explicit error takes precedence
    if (error) return error;

    const digits = phone.replace(/\D/g, '');

    // If empty
    if (!digits) {
      if (touched && required) {
        return 'Mobile number is required';
      }
      return '';
    }

    // India (+91) rules
    if (selectedCountry.code === 'IN' || selectedCountry.dialCode === '+91') {
      // First digit rule (instant check as soon as 1st digit is typed)
      if (!['6', '7', '8', '9'].includes(digits[0])) {
        return 'Indian mobile number must start with 6, 7, 8, or 9';
      }

      // If blurred/touched, show 10 digits required if incomplete
      if (touched && digits.length !== 10) {
        return 'Indian mobile number must be exactly 10 digits';
      }

      // Dummy number detection
      if (digits.length === 10 && isDummyPhoneNumber(digits)) {
        return 'Please enter a valid mobile number (dummy or repeated numbers not allowed)';
      }

      return '';
    }

    // International rules
    if (touched && (digits.length < selectedCountry.minLength || digits.length > selectedCountry.maxLength)) {
      return `${selectedCountry.name} phone number must be ${selectedCountry.minLength} digits`;
    }

    if (digits.length >= selectedCountry.minLength && isDummyPhoneNumber(digits)) {
      return 'Please enter a valid phone number (dummy numbers not allowed)';
    }

    return '';
  }, [error, phone, touched, required, selectedCountry]);

  const activeError = error || liveError;
  const isInvalid = Boolean(activeError);

  const handleCountrySelect = (country: Country) => {
    onCountryChange(country);
    // If phone length exceeds new country max, truncate it
    const cleaned = cleanPhone(phone, country.maxLength);
    if (cleaned !== phone) {
      onPhoneChange(cleaned);
    }
    setIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only accept numeric digits, up to selected country maxLength
    const raw = e.target.value;
    const digitsOnly = cleanPhone(raw, selectedCountry.maxLength);
    onPhoneChange(digitsOnly);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setTouched(true);
    onBlur?.();
  };

  const isPill = variant === 'pill';
  const containerRadius = isPill ? 'rounded-full' : 'rounded-2xl';
  const heightClass = isPill ? 'h-14' : 'h-13';

  return (
    <div className={`relative w-full ${className}`}>
      <div
        className={`flex items-stretch gap-2 transition-all ${
          isInvalid ? 'text-red-500' : ''
        }`}
      >
        {/* Country Selector Button */}
        <div ref={dropdownRef} className="relative flex-shrink-0">
          <button
            type="button"
            onClick={() => !disabled && setIsOpen(!isOpen)}
            disabled={disabled}
            suppressHydrationWarning
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            className={`${heightClass} flex items-center gap-2 border bg-slate-50/80 px-3.5 sm:px-4 text-xs sm:text-sm font-semibold text-slate-800 outline-none transition hover:bg-slate-100 hover:border-slate-300 focus:bg-white focus:ring-2 focus:ring-[#f12131]/30 cursor-pointer ${
              isInvalid ? 'border-red-300 bg-red-50/40' : 'border-slate-200'
            } ${containerRadius}`}
          >
            <CountryFlagIcon
              code={selectedCountry.code}
              name={selectedCountry.name}
              flag={selectedCountry.flag}
              className="h-3.5 w-5"
            />
            <span className="font-bold tracking-tight text-slate-900">
              {selectedCountry.dialCode}
            </span>
            <ChevronDown
              className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-200 ${
                isOpen ? 'rotate-180 text-slate-700' : ''
              }`}
            />
          </button>

          {/* Searchable Country Dropdown Menu */}
          {isOpen && (
            <div
              className={`absolute left-0 z-[10001] w-[300px] sm:w-[320px] overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl animate-in fade-in zoom-in-95 duration-150 ${
                openUpward ? 'bottom-full mb-2' : 'top-full mt-2'
              }`}
            >
              {/* Search Box */}
              <div className="relative mb-2 px-1">
                <div className="relative flex items-center">
                  <Search className="absolute left-3 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search country or code..."
                    suppressHydrationWarning
                    className="h-9 w-full rounded-xl border border-slate-200 bg-slate-50 pl-8 pr-8 text-xs font-medium text-slate-800 placeholder:text-slate-400 outline-none focus:border-[#29247c] focus:bg-white focus:ring-2 focus:ring-[#29247c]/10"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 flex h-4 w-4 items-center justify-center rounded-full bg-slate-200 text-slate-500 hover:bg-slate-300"
                    >
                      <X className="h-2.5 w-2.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Options List */}
              <div className="max-h-[230px] overflow-y-auto overscroll-contain py-1 pr-1 text-left text-xs font-medium space-y-0.5">
                {filteredCountries.length === 0 ? (
                  <div className="py-6 text-center text-xs text-slate-400">
                    No country found for &ldquo;{searchQuery}&rdquo;
                  </div>
                ) : (
                  filteredCountries.map((c) => {
                    const isSelected = c.code === selectedCountry.code;
                    return (
                      <button
                        key={c.code}
                        type="button"
                        onClick={() => handleCountrySelect(c)}
                        className={`flex w-full items-center justify-between rounded-xl px-3 py-2 transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-red-50 text-[#f12131] font-bold'
                            : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 truncate pr-2">
                          <CountryFlagIcon
                            code={c.code}
                            name={c.name}
                            flag={c.flag}
                            className="h-3.5 w-5"
                          />
                          <span className="truncate">{c.name}</span>
                        </div>
                        <div className="flex items-center gap-1.5 flex-shrink-0 text-slate-400">
                          <span className="font-semibold text-slate-600">{c.dialCode}</span>
                          {isSelected && <Check className="h-3.5 w-3.5 text-[#f12131]" />}
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        {/* Numeric Mobile Input */}
        <div className="relative flex-1">
          <input
            id={inputId}
            name={name}
            type="tel"
            inputMode="numeric"
            required={required}
            disabled={disabled}
            value={phone}
            onChange={handleInputChange}
            onBlur={handleBlur}
            placeholder={placeholder || 'Enter mobile number'}
            suppressHydrationWarning
            minLength={selectedCountry.minLength}
            maxLength={selectedCountry.maxLength}
            pattern={selectedCountry.code === 'IN' ? '[6-9][0-9]{9}' : undefined}
            title={
              selectedCountry.code === 'IN'
                ? 'Indian mobile number must be 10 digits starting with 6, 7, 8, or 9'
                : `${selectedCountry.name} phone number`
            }
            aria-invalid={isInvalid}
            className={`w-full ${heightClass} border bg-slate-50/80 px-4 sm:px-5 text-sm font-semibold text-slate-900 placeholder:text-slate-400 outline-none transition hover:border-slate-300 focus:bg-white focus:ring-2 focus:ring-[#f12131]/30 ${
              isInvalid
                ? 'border-red-400 bg-red-50/40 text-red-900 focus:ring-red-400/40'
                : 'border-slate-200'
            } ${containerRadius}`}
          />
        </div>
      </div>

      {/* Inline validation error message */}
      {activeError && (
        <p className="mt-1.5 text-xs font-semibold text-red-600 animate-in fade-in duration-200">
          {activeError}
        </p>
      )}
    </div>
  );
}
