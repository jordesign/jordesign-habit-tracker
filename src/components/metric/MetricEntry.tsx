import React from 'react';
import { useParams } from 'react-router-dom';

export const MetricEntry: React.FC = () => {
  const { id, date } = useParams();

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Metric Entry</h2>
      <p>Metric ID: {id}</p>
      <p>Date: {date}</p>
    </div>
  );
}; 