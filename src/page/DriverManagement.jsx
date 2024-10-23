import React, { useState } from 'react';
import { Users, Search, Filter, Clock, Calendar, Edit } from 'lucide-react';
import UpdateDriverModal from '../components/Modals/UpdateDriver';


// Tùy chọn cho các bộ lọc
const FILTER_OPTIONS = {
  status: [
    { value: '', label: 'All Status' },
    { value: 'on-duty', label: 'On Duty' },
    { value: 'on-leave', label: 'On Leave' },
    { value: 'available', label: 'Available' }
  ],
  workSchedule: [
    { value: '', label: 'All Schedules' },
    { value: 'monday-friday', label: 'Monday - Friday' },
    { value: 'weekend', label: 'Weekend' },
    { value: 'night-shift', label: 'Night Shift' }
  ]
};

// Component Card dùng để hiển thị thông tin dạng thẻ
const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-lg shadow p-4 ${className}`}>
    {children}
  </div>
);

// Component để hiển thị các trường lọc dữ liệu
const FilterField = ({ label, name, value, onChange, type = "text", options = null }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    {options ? (
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full rounded-md border p-2 focus:border-blue-500 focus:outline-none"
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    ) : (
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full rounded-md border p-2 focus:border-blue-500 focus:outline-none"
      />
    )}
  </div>
);

const DriverManagement = () => {
  // Khởi tạo các state quản lý dữ liệu
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    firstName: '',
    lastName: '',
    status: '',
    licenseNumber: '',
    workSchedule: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);

  // Các giá trị không đổi
  const totalPages = 5;
  const totalItems = 42;

  // Dữ liệu mẫu danh sách tài xế
  const driversData = [
    {
      firstName: "Trung",
      lastName: "Nguyen",
      status: "On Duty",
      licenseNumber: "456",
      vehicleId: "TRK-001",
      phone: "+84 123 456 789",
      email: "trungnguyen19102003@gmail.com",
      workSchedule: "Monday - Friday (8:00 AM - 5:00 PM)"
    },
    {
      firstName: "Vũ",
      lastName: "Tran",
      status: "Available",
      licenseNumber: "123",
      vehicleId: "VAN-002",
      phone: "+84 987 654 321",
      email: "Vutran@gmail.com",
      workSchedule: "Weekend (6:00 AM - 6:00 PM)"
    },
    {
      firstName: "Nhan",
      lastName: "Tran",
      status: "On Leave",
      licenseNumber: "789",
      vehicleId: "TRK-002",
      phone: "+84 555 666 777",
      email: "NhanTran@gmail.com",
      workSchedule: "Night Shift (10:00 PM - 6:00 AM)"
    },
    {
      firstName: "Lanh",
      lastName: "Hoang",
      status: "On Duty",
      licenseNumber: "DN-QN-004",
      vehicleId: "PICKUP-001",
      phone: "+84 333 444 555",
      email: "HoangLanh@gmail.com",
      workSchedule: "Monday - Friday (8:00 AM - 5:00 PM)"
    }

    
    
    // Thêm dữ liệu mẫu khác tại đây nếu cần
  ];

  // Xử lý sự kiện thay đổi bộ lọc
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value.toLowerCase()
    }));
  };

  // Xử lý sự kiện tìm kiếm
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  // Xử lý sự kiện khi nhấn nút chỉnh sửa
  const handleEditClick = (driver) => {
    setSelectedDriver(driver);
    setIsUpdateModalOpen(true);
  };

  // Hàm lọc danh sách tài xế theo điều kiện
  const getFilteredDrivers = () => {
    return driversData.filter(driver => {
      // Lọc theo từ khóa tìm kiếm trên tất cả các trường
      const searchMatch = searchTerm === '' || 
        Object.values(driver)
          .join(' ')
          .toLowerCase()
          .includes(searchTerm);

      // Lọc theo từng trường cụ thể
      const firstNameMatch = !filters.firstName || 
        driver.firstName.toLowerCase().includes(filters.firstName);
      const lastNameMatch = !filters.lastName || 
        driver.lastName.toLowerCase().includes(filters.lastName);
      const statusMatch = !filters.status || 
        driver.status.toLowerCase() === filters.status;
      const licenseMatch = !filters.licenseNumber || 
        driver.licenseNumber.toLowerCase().includes(filters.licenseNumber);
      const scheduleMatch = !filters.workSchedule || 
        driver.workSchedule.toLowerCase().includes(filters.workSchedule);

      return searchMatch && 
        firstNameMatch && 
        lastNameMatch && 
        statusMatch && 
        licenseMatch && 
        scheduleMatch;
    });
  };

  // Hiển thị phần bộ lọc
  const renderFilters = () => (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FilterField 
          label="First Name"
          name="firstName"
          value={filters.firstName}
          onChange={handleFilterChange}
        />
        
        <FilterField 
          label="Last Name"
          name="lastName"
          value={filters.lastName}
          onChange={handleFilterChange}
        />
        
        <FilterField 
          label="Status"
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
          options={FILTER_OPTIONS.status}
        />
        
        <FilterField 
          label="License Number"
          name="licenseNumber"
          value={filters.licenseNumber}
          onChange={handleFilterChange}
        />
        
        <FilterField 
          label="Work Schedule"
          name="workSchedule"
          value={filters.workSchedule}
          onChange={handleFilterChange}
          options={FILTER_OPTIONS.workSchedule}
        />
      </div>
    </div>
  );

  // Hiển thị phần header
  const renderHeader = () => (
    <div className="mb-6">
      <h1 className="text-2xl font-bold">Driver Management</h1>
      <p className="text-gray-500">Manage drivers and their schedules</p>
    </div>
  );

  // Hiển thị phần thống kê
  const renderStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500">Total Drivers</p>
            <h3 className="text-2xl font-bold">42</h3>
          </div>
          <Users className="h-8 w-8 text-blue-600" />
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500">On Duty</p>
            <h3 className="text-2xl font-bold">28</h3>
          </div>
          <Clock className="h-8 w-8 text-green-600" />
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500">On Leave</p>
            <h3 className="text-2xl font-bold">5</h3>
          </div>
          <Calendar className="h-8 w-8 text-orange-500" />
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500">Available</p>
            <h3 className="text-2xl font-bold">9</h3>
          </div>
          <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
            <div className="h-3 w-3 bg-green-500 rounded-full"></div>
          </div>
        </div>
      </Card>
    </div>
  );

  // Hiển thị phần tìm kiếm và bộ lọc
  const renderSearchAndFilter = () => (
    <div className="mb-6">
      <div className="flex gap-4 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input 
            type="text" 
            placeholder="Search drivers..."
            value={searchTerm}
            onChange={handleSearchChange}
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
      {showFilters && renderFilters()}
    </div>
  );

  // Hiển thị bảng danh sách tài xế
  const renderTable = () => {
    const filteredDrivers = getFilteredDrivers();
    
    return (
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
                Contact Info
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
            {filteredDrivers.map((driver, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap">{driver.firstName}</td>
                <td className="px-6 py-4 whitespace-nowrap">{driver.lastName}</td>
                <td className="px-6 py-4 whitespace-nowrap">{driver.status}</td>
                <td className="px-6 py-4 whitespace-nowrap">{driver.licenseNumber}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <p>{driver.phone}</p>
                  <p>{driver.email}</p>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{driver.workSchedule}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    className="text-blue-600 hover:text-blue-900"
                    onClick={() => handleEditClick(driver)}
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex items-center justify-between p-4">
          <div>
            Showing {currentPage} of {totalPages} pages (Total items: {totalItems})
          </div>
          <div className="flex gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNumber => (
              <button
                key={pageNumber}
                className={`px-4 py-2 rounded-lg ${
                  pageNumber === currentPage
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
                onClick={() => setCurrentPage(pageNumber)}
              >
                {pageNumber}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Render giao diện chính
  return (
    <div className="mx-auto max-w-7xl p-6 bg-gray-50 min-h-screen">
      {renderHeader()}
      {renderStats()}
      {renderSearchAndFilter()}
      {renderTable()}
      
      {isUpdateModalOpen && (
        <UpdateDriverModal
          isOpen={isUpdateModalOpen}
          onClose={() => setIsUpdateModalOpen(false)}
          driver={selectedDriver}
        />
      )}
    </div>
  );
};

export default DriverManagement;