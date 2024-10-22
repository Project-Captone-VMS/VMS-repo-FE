import React, { useState } from 'react';
import { Users, Search, Filter, MoreVertical, Calendar, Clock } from 'lucide-react';

// Custom Card Component
const Card = ({ children, className = '' }) => {
  return (
    <div className={`bg-white rounded-lg shadow p-4 ${className}`}>
      {children}
    </div>
  );
};

const DriverManagement = () => {
  // State for filters
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    route: '',
    date: '',
  });

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 5;
  const pageSize = 10;
  const totalItems = 42;

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Generate page numbers
  const getPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="dashboard-container mx-auto max-w-7xl p-6">
      {/* Header Section */}
      <div className="header-section mb-6">
        <div className="header-content">
          <h1 className="header-title text-2xl font-bold">Driver Management</h1>
          <p className="header-subtitle text-gray-500">Manage drivers and their schedules</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid grid grid-cols-1 gap-4 2xl:grid-cols-4 mb-6b ">
        {/* Total Drivers Card */}
        <Card>
          <div className="stat-card flex items-center justify-between">
            <div className="stat-info">
              <p className="stat-label text-gray-500">Total Drivers</p>
              <h3 className="stat-value text-2xl font-bold">42</h3>
            </div>
            <Users className="stat-icon h-8 w-8 text-blue-600" />
          </div>
        </Card>

        {/* On Duty Card */}
        <Card>
          <div className="stat-card flex items-center justify-between">
            <div className="stat-info">
              <p className="stat-label text-gray-500">On Duty</p>
              <h3 className="stat-value text-2xl font-bold">28</h3>
            </div>
            <Clock className="stat-icon h-8 w-8 text-green-600" />
          </div>
        </Card>

        {/* On Leave Card */}
        <Card>
          <div className="stat-card flex items-center justify-between">
            <div className="stat-info">
              <p className="stat-label text-gray-500">On Leave</p>
              <h3 className="stat-value text-2xl font-bold">5</h3>
            </div>
            <Calendar className="stat-icon h-8 w-8 text-orange-500" />
          </div>
        </Card>

        {/* Available Card */}
        <Card>
          <div className="stat-card flex items-center justify-between">
            <div className="stat-info">
              <p className="stat-label text-gray-500">Available</p>
              <h3 className="stat-value text-2xl font-bold">9</h3>
            </div>
            <div className="status-indicator flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
              <div className="indicator-dot h-3 w-3 rounded-full bg-green-500"></div>
            </div>
          </div>
        </Card>
      </div>

      {/* Search and Filter Section */}
      <div className="search-filter-section mb-6">
        <div className="flex gap-4 mb-4">
          <div className="search-container relative flex-1">
            <Search className="search-icon absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search drivers..."
              className="search-input w-full rounded-lg border py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button 
            className="filter-btn flex items-center gap-2 rounded-lg border px-4 py-2 hover:bg-gray-50"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-5 w-5" />
            Filters
          </button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="filter-panel rounded-lg border bg-white p-4 shadow-sm">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="filter-group">
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
                >
                  <option value="">All Status</option>
                  <option value="on-duty">On Duty</option>
                  <option value="on-leave">On Leave</option>
                  <option value="available">Available</option>
                </select>
              </div>

              <div className="filter-group">
                <label className="block text-sm font-medium text-gray-700 mb-1">Route</label>
                <select
                  name="route"
                  value={filters.route}
                  onChange={handleFilterChange}
                  className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
                >
                  <option value="">All Routes</option>
                  <option value="hn-hcm">HN-HCM</option>
                  <option value="hn-dn">HN-DN</option>
                  <option value="hcm-dn">HCM-DN</option>
                </select>
              </div>

              <div className="filter-group">
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  name="date"
                  value={filters.date}
                  onChange={handleFilterChange}
                  className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Drivers Table */}
      <div className="drivers-table-container overflow-hidden rounded-lg bg-white shadow">
        <table className="drivers-table min-w-full divide-y divide-gray-200">
          <thead className="table-header bg-gray-50">
            <tr>
              <th className="column-header px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Driver Info
              </th>
              <th className="column-header px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Status
              </th>
              <th className="column-header px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Current Assignment
              </th>
              <th className="column-header px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Contact Info
              </th>
              <th className="column-header px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="table-body divide-y divide-gray-200 bg-white">
            <tr className="table-row">
              <td className="driver-info-cell px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <img 
                    src="/src/assets/image/anh-cv-01.jpg" 
                    alt="Driver" 
                    className="driver-avatar h-10 w-10 rounded-full mr-3"
                  />
                  <div className="driver-details">
                    <div className="driver-name font-medium">Trung Nguyen</div>
                    <div className="driver-id text-sm text-gray-500">ID: DRV-001</div>
                  </div>
                </div>
              </td>
              <td className="status-cell px-6 py-4 whitespace-nowrap">
                <span className="status-badge inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
                  On Duty
                </span>
              </td>
              <td className="assignment-cell px-6 py-4 whitespace-nowrap">
                <div className="route text-sm">Route: DN-QN</div>
                <div className="vehicle text-sm text-gray-500">Vehicle: TRK-001</div>
              </td>
              <td className="contact-cell px-6 py-4 whitespace-nowrap">
                <div className="phone text-sm">+84 123 456 789</div>
                <div className="email text-sm text-gray-500">trungnguyen19102003@gmail.com</div>
              </td>
              <td className="actions-cell px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button className="action-btn text-gray-400 hover:text-gray-500">
                  <MoreVertical className="h-5 w-5" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Enhanced Pagination Section */}
      <div className="pagination-section mt-4 flex items-center justify-between rounded-lg bg-white px-4 py-3 border-t border-gray-200">
        <div className="pagination-info flex items-center">
          <span className="text-sm text-gray-700">
            Showing{' '}
            <span className="font-medium">{(currentPage - 1) * pageSize + 1}</span>
            {' '}to{' '}
            <span className="font-medium">
              {Math.min(currentPage * pageSize, totalItems)}
            </span>
            {' '}of{' '}
            <span className="font-medium">{totalItems}</span> results
          </span>
        </div>
        <div className="pagination-controls flex items-center space-x-2">
          <button 
            className="page-btn rounded-md border px-3 py-1 hover:bg-gray-50 disabled:opacity-50"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          
          {getPageNumbers().map(pageNum => (
            <button
              key={pageNum}
              onClick={() => setCurrentPage(pageNum)}
              className={`page-btn rounded-md border px-3 py-1 
                ${currentPage === pageNum 
                  ? 'border-blue-600 bg-blue-50 text-blue-600' 
                  : 'hover:bg-gray-50'
                }`}
            >
              {pageNum}
            </button>
          ))}
          
          <button 
            className="page-btn rounded-md border px-3 py-1 hover:bg-gray-50 disabled:opacity-50"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default DriverManagement;