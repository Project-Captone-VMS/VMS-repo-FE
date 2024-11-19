import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllDriver, deleteDriver } from "../../services/apiRequest";
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
      const data = await getAllDriver();
      setDrivers(data);
    } catch (error) {
      console.error("Error fetching drivers:", error);
      Swal.fire("Error!", "Failed to fetch drivers.", "error");
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
        await fetchDrivers();
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
    await fetchDrivers();
    Swal.fire("Success!", "Driver updated successfully.", "success");
  };

  const filteredDrivers = getFilteredDrivers(drivers, searchTerm, filters);
  const paginatedDrivers = filteredDrivers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Driver Management</h1>

      <Stats />

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
  );
};

export default DriverManagement;
