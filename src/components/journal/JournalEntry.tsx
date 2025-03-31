import React from 'react';
import { useParams } from 'react-router-dom';

export const JournalEntry: React.FC = () => {
  const { date } = useParams();

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Journal Entry</h2>
      <p>Date: {date}</p>
    </div>
  );
}; 