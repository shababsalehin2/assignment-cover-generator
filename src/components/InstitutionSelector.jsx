// src/components/InstitutionSelector.jsx
import { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Building2, X } from 'lucide-react';
import { institutions } from '../data/institutions';
import clsx from 'clsx';

export function InstitutionLogo({ institution, size = 'md', customLogo }) {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-20 h-20 text-base',
    xl: 'w-28 h-28 text-lg'
  };

  // 1. Custom uploaded logo (base64) takes top priority
  if (customLogo) {
    return (
      <img
        src={customLogo}
        alt="Institution logo"
        className={clsx('rounded-lg object-contain', sizes[size])}
      />
    );
  }

  // 2. Real logo file from public/logos/
  if (institution?.logo) {
    return (
      <img
        src={institution.logo}
        alt={`${institution.name} logo`}
        className={clsx('rounded-lg object-contain', sizes[size])}
        onError={e => { e.currentTarget.style.display = 'none'; }}
      />
    );
  }

  // 3. No logo — fallback coloured badge
  if (!institution) {
    return (
      <div className={clsx(
        'rounded-lg flex items-center justify-center font-bold bg-gray-100 text-gray-400',
        sizes[size]
      )}>
        <Building2 className="w-1/2 h-1/2" />
      </div>
    );
  }

  return (
    <div
      className={clsx('rounded-lg flex items-center justify-center font-bold border-2 shrink-0', sizes[size])}
      style={{
        backgroundColor: institution.logoBg,
        color: institution.logoColor,
        borderColor: institution.logoColor + '40'
      }}
    >
      <span className="leading-none text-center px-1" style={{ fontSize: 'clamp(8px, 1.5vw, 14px)' }}>
        {institution.shortName}
      </span>
    </div>
  );
}

export default function InstitutionSelector({ value, onChange, error }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  const selected = institutions.find(i => i.id === value);

  const filtered = institutions.filter(inst =>
    inst.name.toLowerCase().includes(search.toLowerCase()) ||
    inst.shortName.toLowerCase().includes(search.toLowerCase()) ||
    inst.type.toLowerCase().includes(search.toLowerCase())
  );

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
        setSearch('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = (institution) => {
    onChange(institution);
    setIsOpen(false);
    setSearch('');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
          setTimeout(() => inputRef.current?.focus(), 50);
        }}
        className={clsx(
          'w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl border text-left',
          'bg-white dark:bg-surface-800 transition-all duration-150',
          'focus:outline-none focus:ring-2 focus:ring-primary-500',
          error
            ? 'border-red-400 ring-1 ring-red-300'
            : 'border-gray-200 dark:border-gray-700 hover:border-primary-300'
        )}
      >
        {selected ? (
          <>
            <InstitutionLogo institution={selected} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                {selected.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{selected.type}</p>
            </div>
          </>
        ) : (
          <>
            <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
              <Building2 className="w-4 h-4 text-gray-400" />
            </div>
            <span className="text-sm text-gray-400 dark:text-gray-500 flex-1">Select institution...</span>
          </>
        )}
        <ChevronDown className={clsx(
          'w-4 h-4 text-gray-400 transition-transform duration-200 shrink-0',
          isOpen && 'rotate-180'
        )} />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1.5 z-50 bg-white dark:bg-surface-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl overflow-hidden animate-slide-up">
          {/* Search */}
          <div className="p-2 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-surface-800 rounded-lg">
              <Search className="w-4 h-4 text-gray-400 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search institutions..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="flex-1 text-sm bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none"
              />
              {search && (
                <button onClick={() => setSearch('')} className="text-gray-400 hover:text-gray-600">
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* List */}
          <div className="max-h-64 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="px-4 py-6 text-center text-sm text-gray-500">
                No institutions found
              </div>
            ) : (
              filtered.map(inst => (
                <button
                  key={inst.id}
                  type="button"
                  onClick={() => handleSelect(inst)}
                  className={clsx(
                    'w-full flex items-center gap-3 px-3 py-2.5 hover:bg-primary-50 dark:hover:bg-primary-950 transition-colors duration-100 text-left',
                    value === inst.id && 'bg-primary-50 dark:bg-primary-950'
                  )}
                >
                  <InstitutionLogo institution={inst} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{inst.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{inst.type} • {inst.address.split(',').slice(-1)[0].trim()}</p>
                  </div>
                  {value === inst.id && (
                    <div className="w-2 h-2 rounded-full bg-primary-500 shrink-0" />
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
