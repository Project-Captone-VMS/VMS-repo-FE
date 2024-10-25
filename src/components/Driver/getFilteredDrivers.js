// components/getFilteredDrivers.js

/**
 * Hàm lọc danh sách tài xế dựa vào từ khóa tìm kiếm và các bộ lọc.
 * @param {Array} drivers - Danh sách tài xế
 * @param {string} searchTerm - Từ khóa tìm kiếm
 * @param {Object} filters - Bộ lọc gồm firstName, lastName, status, licenseNumber, workSchedule
 * @returns {Array} - Danh sách tài xế sau khi lọc
 */
const getFilteredDrivers = (drivers, searchTerm, filters) => {
    return drivers.filter(driver => {
      const searchMatch = searchTerm === '' || 
        Object.values(driver).join(' ').toLowerCase().includes(searchTerm.toLowerCase());
  
      const firstNameMatch = !filters.firstName || 
        driver.firstName.toLowerCase().includes(filters.firstName.toLowerCase());
      const lastNameMatch = !filters.lastName || 
        driver.lastName.toLowerCase().includes(filters.lastName.toLowerCase());
      const statusMatch = !filters.status || 
        driver.status.toLowerCase() === filters.status.toLowerCase();
      const licenseMatch = !filters.licenseNumber || 
        driver.licenseNumber.toLowerCase().includes(filters.licenseNumber.toLowerCase());
      const scheduleMatch = !filters.workSchedule || 
        driver.workSchedule.toLowerCase().includes(filters.workSchedule.toLowerCase());
  
      return searchMatch && firstNameMatch && lastNameMatch && statusMatch && licenseMatch && scheduleMatch;
    });
  };
  
  export default getFilteredDrivers;
  