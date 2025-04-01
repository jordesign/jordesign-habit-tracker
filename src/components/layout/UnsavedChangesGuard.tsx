import { useEffect } from 'react';
import { useNavigate, useBeforeUnload } from 'react-router-dom';
import { useFormState } from '../../context/FormContext';

export const UnsavedChangesGuard: React.FC = () => {
  const navigate = useNavigate();
  const { hasUnsavedChanges } = useFormState();

  useBeforeUnload(
    (event) => {
      if (hasUnsavedChanges) {
        event.preventDefault();
        return '';
      }
    },
    { capture: true }
  );

  useEffect(() => {
    const handleBeforeNavigate = (event: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        const confirmMessage = 'You have unsaved changes. Are you sure you want to leave?';
        event.returnValue = confirmMessage;
        return confirmMessage;
      }
    };

    window.addEventListener('beforeunload', handleBeforeNavigate);
    return () => window.removeEventListener('beforeunload', handleBeforeNavigate);
  }, [hasUnsavedChanges]);

  return null;
}; 