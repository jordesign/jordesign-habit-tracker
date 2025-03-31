import React, { useState, useRef } from 'react';
import { Search } from 'lucide-react';
import { ICONS, type IconName } from './iconList';

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
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Get filtered icons based on search query
  const filteredIcons = searchQuery
    ? ICONS.filter(icon => icon.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : ICONS;

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 max-h-[600px] overflow-hidden flex flex-col">
      {/* Search */}
      <div className="mb-4">
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
      </div>

      {/* Icons Grid */}
      <div className="overflow-y-auto">
        <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2">
          {filteredIcons.map(({ name, icon: IconComponent }) => (
            <button
              key={name}
              onClick={() => onChange(name)}
              className={`
                aspect-square p-2 rounded-lg flex items-center justify-center
                ${value === name
                  ? 'bg-blue-100 text-blue-700 ring-2 ring-blue-500'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'}
                focus:outline-none focus:ring-2 focus:ring-blue-500
              `}
            >
              <IconComponent size={24} />
            </button>
          ))}
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