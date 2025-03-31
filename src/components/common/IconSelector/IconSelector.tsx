import React, { useState, useEffect, useRef } from 'react';
import * as Icons from 'lucide-react';
import { Search } from 'lucide-react';
import { IconCategories } from './IconCategories';
import type { IconName } from './types';

// Icon categories for grouping
const ICON_CATEGORIES = {
  Common: ['heart', 'star', 'home', 'settings', 'user', 'mail', 'bell', 'calendar'],
  Weather: ['sun', 'moon', 'cloud', 'cloudRain', 'cloudSnow', 'wind'],
  Arrows: ['arrowUp', 'arrowDown', 'arrowLeft', 'arrowRight', 'chevronUp', 'chevronDown'],
  Media: ['play', 'pause', 'stop', 'music', 'video', 'image'],
  Objects: ['book', 'file', 'folder', 'camera', 'phone', 'printer'],
  Health: ['activity', 'heartPulse', 'stethoscope', 'pill', 'weight', 'dumbbell'],
  // Add more categories as needed
} as const;

interface IconSelectorProps {
  value?: IconName;
  onChange: (iconName: IconName) => void;
  onClose?: () => void;
}

export const IconSelector: React.FC<IconSelectorProps> = ({
  value,
  onChange,
  onClose
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof ICON_CATEGORIES>('Common');
  const [filteredIcons, setFilteredIcons] = useState<IconName[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Filter icons based on search query
  useEffect(() => {
    if (!searchQuery) {
      setFilteredIcons(ICON_CATEGORIES[selectedCategory] as IconName[]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const allIcons = Object.values(ICON_CATEGORIES).flat() as IconName[];
    const filtered = allIcons.filter(iconName => 
      iconName.toLowerCase().includes(query)
    );
    setFilteredIcons(filtered);
  }, [searchQuery, selectedCategory]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'Escape':
        onClose?.();
        break;
      case 'Tab':
        if (!e.shiftKey && document.activeElement === searchInputRef.current) {
          e.preventDefault();
          const firstIcon = document.querySelector('[data-icon-button]');
          (firstIcon as HTMLElement)?.focus();
        }
        break;
    }
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-lg p-4 max-h-[600px] overflow-hidden flex flex-col"
      onKeyDown={handleKeyDown}
    >
      {/* Search and Category Selection */}
      <div className="space-y-4 mb-4">
        <div className="relative">
          <Search 
            size={20} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search icons..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            autoFocus
          />
        </div>

        {!searchQuery && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {Object.keys(ICON_CATEGORIES).map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category as keyof typeof ICON_CATEGORIES)}
                className={`
                  px-3 py-1 rounded-full text-sm whitespace-nowrap
                  ${selectedCategory === category
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
                `}
              >
                {category}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Icons Grid */}
      <div className="overflow-y-auto flex-1">
        <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2">
          {filteredIcons.map((iconName) => {
            const IconComponent = Icons[iconName as keyof typeof Icons] as React.FC<Icons.LucideProps>;
            return (
              <button
                key={iconName}
                onClick={() => onChange(iconName)}
                data-icon-button
                className={`
                  aspect-square p-2 rounded-lg flex items-center justify-center
                  ${value === iconName
                    ? 'bg-blue-100 text-blue-700 ring-2 ring-blue-500'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'}
                  focus:outline-none focus:ring-2 focus:ring-blue-500
                `}
              >
                <IconComponent size={24} />
              </button>
            );
          })}
        </div>
      </div>

      {/* No Results Message */}
      {filteredIcons.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No icons found for "{searchQuery}"
        </div>
      )}
    </div>
  );
}; 