// components/DriverTable.jsx
import React from 'react';
import { Edit, Trash2 } from 'lucide-react';

const DriverTable = ({ drivers, onEditClick, onDelete }) => (
  <div className="bg-white rounded-lg shadow overflow-hidden">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
            First Name
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
            Last Name
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
            Status
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
            License Number
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
            Work Schedule
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {drivers.map((driver, index) => (
          <tr key={index}>
            <td className="px-6 py-4 whitespace-nowrap">{driver.firstName}</td>
            <td className="px-6 py-4 whitespace-nowrap">{driver.lastName}</td>
            <td className="px-6 py-4 whitespace-nowrap">{driver.status}</td>
            <td className="px-6 py-4 whitespace-nowrap">{driver.licenseNumber}</td>
            <td className="px-6 py-4 whitespace-nowrap">{driver.workSchedule}</td>
            <td className="px-6 py-4 whitespace-nowrap">
              <button className="text-blue-600 hover:text-blue-900" onClick={() => onEditClick(driver)}>
                <Edit className="h-5 w-5" />
              </button>
              <button className="text-blue-600 hover:text-blue-900" onClick={() => onDelete(driver)}>
                <Trash2 className="h-5 w-5" />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default DriverTable;
