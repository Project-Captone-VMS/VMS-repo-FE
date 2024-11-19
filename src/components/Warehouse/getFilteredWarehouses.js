const getFilteredWarehouses = (warehouses, searchTerm, filters) => {
  return warehouses.filter(warehouse => {
    // Calculate utilization rate for filtering
    const utilizationRate = warehouse.capacity > 0 
      ? ((warehouse.currentStock / warehouse.capacity) * 100)
      : 0;

    // Search match (check warehouse name and location)
    const searchMatch = searchTerm === '' || 
      warehouse.warehouseName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      warehouse.location?.toLowerCase().includes(searchTerm.toLowerCase());

    // Individual filter matches
    const warehouseNameMatch = !filters.warehouseName || 
      warehouse.warehouseName?.toLowerCase().includes(filters.warehouseName.toLowerCase());
    
    const locationMatch = !filters.location || 
      warehouse.location?.toLowerCase().includes(filters.location.toLowerCase());
    
    const statusMatch = !filters.status || 
      (filters.status === 'full' && utilizationRate >= 90) ||
      (filters.status === 'available' && utilizationRate < 90) ||
      (filters.status === 'active' && warehouse.currentStock > 0);

    // Utilization rate filter
    const utilizationMatch = !filters.utilizationRate ||
      (filters.utilizationRate === 'low' && utilizationRate <= 30) ||
      (filters.utilizationRate === 'medium' && utilizationRate > 30 && utilizationRate <= 70) ||
      (filters.utilizationRate === 'high' && utilizationRate > 70);

    // Capacity and stock filters
    const capacityMatch = !filters.minCapacity || 
      warehouse.capacity >= parseInt(filters.minCapacity);
    
    const currentStockMatch = !filters.maxCurrentStock || 
      warehouse.currentStock <= parseInt(filters.maxCurrentStock);

    return searchMatch && 
           warehouseNameMatch && 
           locationMatch && 
           statusMatch && 
           utilizationMatch && 
           capacityMatch && 
           currentStockMatch;
  });
};

export default getFilteredWarehouses; 