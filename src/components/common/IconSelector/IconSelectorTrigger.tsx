import React, { useState } from 'react';
import * as Icons from 'lucide-react';
import { IconSelectorModal } from './IconSelectorModal';
import type { IconName } from './types';

interface IconSelectorTriggerProps {
  value?: IconName;
  onChange: (iconName: IconName) => void;
  className?: string;
}

export const IconSelectorTrigger: React.FC<IconSelectorTriggerProps> = ({
  value,
  onChange,
  className
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const IconComponent = value ? Icons[value as keyof typeof Icons] : Icons.Image;

  return (
    <>
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className={`
          inline-flex items-center justify-center p-2 rounded-lg border border-gray-300
          hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
          ${className}
        `}
      >
        <IconComponent size={24} />
      </button>

      <IconSelectorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        value={value}
        onChange={onChange}
      />
    </>
  );
}; 