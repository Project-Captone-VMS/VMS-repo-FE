// getFilteredDrivers.js
const getFilteredDrivers = (drivers = [], searchTerm = '', filters = {}) => {
  // Return empty array if drivers is null/undefined
  if (!drivers) return [];

  return drivers
    .filter((driver) => {
      // Nếu không có search term, giữ lại tất cả
      if (!searchTerm) return true;

      // Convert search term to lowercase for case-insensitive search
      const term = searchTerm.toLowerCase();
      const fullName = `${driver.firstName} ${driver.lastName}`.toLowerCase();

      // Search trong firstName, lastName hoặc fullName
      return (
        driver.firstName?.toLowerCase().includes(term) ||
        driver.lastName?.toLowerCase().includes(term) ||
        fullName.includes(term) ||
        driver.licenseNumber?.toLowerCase().includes(term)
      );
    })
    .filter((driver) => {
      // Xử lý các filters
      for (const [key, value] of Object.entries(filters)) {
        if (!value) continue; // Skip empty filters
        
        // Optional chaining để tránh lỗi khi driver[key] là undefined
        if (driver[key]?.toLowerCase() !== value.toLowerCase() && value !== '') {
          return false;
        }
      }
      return true;
    });
};

export default getFilteredDrivers;