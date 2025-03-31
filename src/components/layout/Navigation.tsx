import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Activity, BarChart3 } from 'lucide-react';

export const Navigation: React.FC = () => {
  return (
    <nav className="w-64 bg-white shadow-sm p-4">
      <ul className="space-y-2">
        <li>
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center gap-2 p-2 rounded-lg ${
                isActive ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-50'
              }`
            }
          >
            <LayoutDashboard size={20} />
            Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/habits"
            className={({ isActive }) =>
              `flex items-center gap-2 p-2 rounded-lg ${
                isActive ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-50'
              }`
            }
          >
            <Activity size={20} />
            Habits
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/metrics"
            className={({ isActive }) =>
              `flex items-center gap-2 p-2 rounded-lg ${
                isActive ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-50'
              }`
            }
          >
            <BarChart3 size={20} />
            Metrics
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}; 