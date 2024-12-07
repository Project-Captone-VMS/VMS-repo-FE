import React, { useState, useEffect } from "react";
import { useNavigate, Link } from 'react-router-dom';
import { getAllDrivers, deleteDriver } from "../../services/apiRequest";
import Swal from "sweetalert2";
import DriverTable from "../../components/Driver/DriverTable";
import SearchAndFilter from "../../components/Driver/SearchAndFilter";
import Stats from "../../components/Driver/Stats";
import Pagination from "../../components/Pagination";
import getFilteredDrivers from "../../components/Driver/getFilteredDrivers";
import UpdateDriver from "../../components/Modals/UpdateDriver";

const DriverManagement = () => {
  const navigate = useNavigate();
  const [drivers, setDrivers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  const [filters, setFilters] = useState({
    firstName: "",
    lastName: "",
    status: "",
    licenseNumber: "",
    workSchedule: "",
  });

  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(drivers.length / itemsPerPage);

  // Fetch drivers data
  const fetchDrivers = async () => {
    try {
      const data = await getAllDrivers();
      console.log(data);
      if (Array.isArray(data)) {
        setDrivers(data);
      } else {
        console.error('Unexpected data format:', data);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Received unexpected data format from server'
        });
      }
    } catch (error) {
      console.error('Error fetching drivers:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Failed to fetch drivers'
      });
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleDeleteDriver = async (driver) => {
    const confirmResult = await Swal.fire({
      title: "Are you sure?",
      text: `Do you want to delete driver ${driver.firstName} ${driver.lastName}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
    });

    if (confirmResult.isConfirmed) {
      try {
        await deleteDriver(driver.driverId);
        await fetchDrivers(); // Refresh the list after deletion
        Swal.fire("Deleted!", "The driver has been deleted.", "success");
      } catch (error) {
        console.error("Error deleting driver:", error);
        Swal.fire("Error!", "Failed to delete the driver.", "error");
      }
    }
  };

  const handleEditClick = (driver) => {
    setSelectedDriver(driver);
    setIsUpdateModalOpen(true);
  };

  const handleCloseUpdateModal = () => {
    setIsUpdateModalOpen(false);
    setSelectedDriver(null);
  };

  const handleDriverUpdated = async () => {
    await fetchDrivers(); // Refresh the drivers list
    Swal.fire("Success!", "Driver updated successfully.", "success");
  };

  // Filtered and paginated drivers
  const filteredDrivers = getFilteredDrivers(drivers, searchTerm, filters);
  const paginatedDrivers = filteredDrivers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Pagination handler
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <nav className="bg-blue-600 p-4 mb-6">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-white font-bold text-xl">Fleet Management</div>
          <div>
            <Link to="/driver" className="text-white hover:text-blue-200 mr-4">Drivers</Link>
            <Link to="/expenses" className="text-white hover:text-blue-200">Expenses</Link>
          </div>
        </div>
      </nav>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-4">Driver Management</h1>

        <Stats drivers={drivers} />

        <SearchAndFilter
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          filters={filters}
          onFilterChange={handleFilterChange}
        />

        <DriverTable
          drivers={paginatedDrivers}
          onEditClick={handleEditClick}
          onDelete={handleDeleteDriver}
        />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          totalItems={filteredDrivers.length}
          onPageChange={handlePageChange}
        />

        {selectedDriver && (
          <UpdateDriver
            isOpen={isUpdateModalOpen}
            onClose={handleCloseUpdateModal}
            driver={selectedDriver}
            onDriverUpdated={handleDriverUpdated}
          />
        )}
      </div>
    </div>
  );
};

export default DriverManagement;