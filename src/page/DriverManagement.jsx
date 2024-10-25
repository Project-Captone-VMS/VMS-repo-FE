// DriverManagement.jsx
import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { getAllDriver, deleteDriver } from '../services/api';

import DriverTable from '../components/Driver/DriverTable';
import SearchAndFilter from '../components/Driver/SearchAndFilter';
import Stats from '../components/Driver/Stats';
import UpdateDriverModal from '../components/Modals/UpdateDriver';
import Pagination from '../components/Layouts/Pagination';
import getFilteredDrivers from '../components/Driver/getFilteredDrivers';

const DriverManagement = () => {
  // State Management
  const [drivers, setDrivers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    firstName: '',
    lastName: '',
    status: '',
    licenseNumber: '',
    workSchedule: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Fetch drivers when component mounts
  useEffect(() => {
    loadDrivers();
  }, []);

  const loadDrivers = async () => {
    try {
      setLoading(true);
      const response = await getAllDriver();
      setDrivers(response.data);
    } catch (error) {
      console.error('Error fetching drivers:', error);
      Swal.fire('Error!', 'Failed to fetch drivers.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Search and filter handlers
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value
    }));
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handleDeleteDriver = async (driver) => {
    const confirmResult = await Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete driver ${driver.firstName} ${driver.lastName}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!'
    });

    if (confirmResult.isConfirmed) {
      try {
        setLoading(true);
        await deleteDriver(driver.id);
        await loadDrivers();
        Swal.fire('Deleted!', 'The driver has been deleted.', 'success');
      } catch (error) {
        console.error('Error deleting driver:', error);
        Swal.fire('Error!', 'Failed to delete the driver.', 'error');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEditClick = (driver) => {
    setSelectedDriver(driver);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedDriver(null);
    setIsModalOpen(false);
  };

  // Get filtered and paginated data
  const filteredDrivers = getFilteredDrivers(drivers, searchTerm, filters);
  const totalPages = Math.ceil(filteredDrivers.length / itemsPerPage);
  const paginatedDrivers = filteredDrivers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Pagination handler
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Driver Management</h1>
      
      {/* Stats */}
      <Stats drivers={drivers} />

      {/* Search and Filter */}
      <SearchAndFilter 
        searchTerm={searchTerm} 
        onSearchChange={handleSearchChange}
        showFilters={showFilters} 
        setShowFilters={setShowFilters}
        filters={filters}
        onFilterChange={handleFilterChange}
      />

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : (
        <>
          {/* Driver Table */}
          <DriverTable 
            drivers={paginatedDrivers}
            onEditClick={handleEditClick}
            onDelete={handleDeleteDriver}
          />

          {/* Show Pagination only if there are drivers */}
          {filteredDrivers.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredDrivers.length}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}

      {/* Update Driver Modal */}
      {isModalOpen && (
        <UpdateDriverModal
          driver={selectedDriver}
          onClose={closeModal}
          onSave={async () => {
            await loadDrivers();
            closeModal();
          }}
        />
      )}
    </div>
  );
};

export default DriverManagement;