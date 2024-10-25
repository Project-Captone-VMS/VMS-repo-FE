import React, { useState, useMemo } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableRow } from '../Vehicle/Table';
import Pagination from '../Layouts/Pagination';
import { Input } from "@/components/ui/input";
import AddMaintenanceModal from '../Modals/AddMaintenance';
const FilterModal = ({ isOpen, onClose, filters, setFilters }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-end z-50">
      <div className="bg-white h-full w-[400px] p-6 shadow-lg overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            <h2 className="text-lg font-semibold">Filters</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Vehicle ID</label>
            <Input
              placeholder="Enter vehicle ID"
              value={filters.vehicleId}
              onChange={(e) => setFilters(prev => ({
                ...prev,
                vehicleId: e.target.value
              }))}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Date</label>
            <Input
              type="date"
              value={filters.date}
              onChange={(e) => setFilters(prev => ({
                ...prev,
                date: e.target.value
              }))}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Status</label>
            <Select 
              value={filters.status} 
              onValueChange={(value) => setFilters(prev => ({
                ...prev,
                status: value
              }))}
            >
              <SelectTrigger className="w-full bg-white">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
};

const MaintenanceTable = ({ maintenanceRecords, currentPage, itemsPerPage }) => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedRecords = maintenanceRecords.slice(startIndex, endIndex);

  return (
    <Table 
      headers={[
        'Vehicle ID',
        'Date',
        'Type',
        'Description',
        'Cost',
        'Status'
      ]}
    >
      {displayedRecords.map((record, index) => (
        <TableRow key={index}>
          <div className="font-medium">{record.vehicleId}</div>
          <div>{record.date}</div>
          <div>{record.type}</div>
          <div>{record.description}</div>
          <div>${record.cost}</div>
          <div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              record.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
            }`}>
              {record.status}
            </span>
          </div>
        </TableRow>
      ))}
    </Table>
  );
};

const MaintenanceTab = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    vehicleId: '',
    date: '',
    status: 'all'
  });
  const [maintenanceRecords, setMaintenanceRecords] = useState([
    { vehicleId: 'VH001', date: '2024-03-15', type: 'Routine', description: 'Oil change', cost: 250, status: 'Completed' },
    { vehicleId: 'VH002', date: '2024-04-01', type: 'Repair', description: 'Brake system overhaul', cost: 500, status: 'In Progress' },
  ]);

  const itemsPerPage = 5;

  const filteredRecords = useMemo(() => {
    return maintenanceRecords.filter(record => {
      const matchesSearch = 
        record.vehicleId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesVehicleId = !filters.vehicleId || 
        record.vehicleId.toLowerCase().includes(filters.vehicleId.toLowerCase());
      
      const matchesDate = !filters.date || 
        record.date === filters.date;
      
      const matchesStatus = filters.status === 'all' || 
        record.status === filters.status;

      return matchesSearch && matchesVehicleId && matchesDate && matchesStatus;
    });
  }, [maintenanceRecords, searchTerm, filters]);

  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);

  const handleAddMaintenance = (newRecord) => {
    setMaintenanceRecords(prevRecords => [...prevRecords, newRecord]);
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4 items-center bg-white p-4 rounded-lg shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-12 bg-white border-0 ring-1 ring-gray-200"
          />
        </div>
        <Button 
          variant="outline" 
          className="h-12 px-4 flex items-center gap-2 bg-white border-0 ring-1 ring-gray-200"
          onClick={() => setIsFilterModalOpen(true)}
        >
          <Filter className="h-4 w-4" />
          Filters
        </Button>
      </div>

      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        filters={filters}
        setFilters={setFilters}
      />

      <AddMaintenanceModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddMaintenance}
      />

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Maintenance History</CardTitle>
            <Button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-slate-300 text-black hover:bg-slate-400"
            >
              <Plus className="w-4 h-4 mr-2" /> ADD Schedule Maintenance
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <MaintenanceTable 
            maintenanceRecords={filteredRecords}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
          />
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default MaintenanceTab;
