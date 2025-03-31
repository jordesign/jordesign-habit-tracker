import React from 'react';
import { IconSelector } from './IconSelector';
import type { IconName } from './types';

interface IconSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  value?: IconName;
  onChange: (iconName: IconName) => void;
}

export const IconSelectorModal: React.FC<IconSelectorModalProps> = ({
  isOpen,
  onClose,
  value,
  onChange
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="w-full max-w-2xl">
        <IconSelector
          value={value}
          onChange={(iconName) => {
            onChange(iconName);
            onClose();
          }}
          onClose={onClose}
        />
      </div>
    </div>
  );
}; 