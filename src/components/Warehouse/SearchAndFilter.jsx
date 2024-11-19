import React from 'react';
import { Search, Filter } from 'lucide-react';
import FilterField from './FilterField';
import { FILTER_OPTIONS } from './FilterOptions';

const SearchAndFilter = ({ searchTerm, onSearchChange, showFilters, setShowFilters, filters, onFilterChange }) => (
  <div className="mb-6">
    <div className="flex gap-4 mb-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input 
          type="text" 
          placeholder="Search by warehouse name or location..."
          value={searchTerm}
          onChange={onSearchChange}
          className="w-full rounded-lg border py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <button 
        className="flex items-center gap-2 rounded-lg border px-4 py-2 hover:bg-gray-50" 
        onClick={() => setShowFilters(!showFilters)}
      >
        <Filter className="h-5 w-5" />
        Filters
      </button>
    </div>
    {showFilters && (
      <div className="rounded-lg border bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FilterField 
            label="Warehouse Name" 
            name="warehouseName" 
            value={filters.warehouseName} 
            onChange={onFilterChange} 
          />
          <FilterField 
            label="Location" 
            name="location" 
            value={filters.location} 
            onChange={onFilterChange} 
          />
          <FilterField 
            label="Status" 
            name="status" 
            value={filters.status} 
            onChange={onFilterChange} 
            options={FILTER_OPTIONS.status} 
          />
          <FilterField 
            label="Utilization" 
            name="utilizationRate" 
            value={filters.utilizationRate} 
            onChange={onFilterChange} 
            options={FILTER_OPTIONS.utilizationRate} 
          />
          <FilterField 
            label="Minimum Capacity" 
            name="minCapacity" 
            value={filters.minCapacity} 
            onChange={onFilterChange} 
            type="number" 
          />
          <FilterField 
            label="Maximum Stock" 
            name="maxCurrentStock" 
            value={filters.maxCurrentStock} 
            onChange={onFilterChange} 
            type="number" 
          />
        </div>
      </div>
    )}
  </div>
);

export default SearchAndFilter; 