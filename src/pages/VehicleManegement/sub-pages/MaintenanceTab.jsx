import React, { useState, useMemo } from "react";
import { Plus, Search, Filter } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Table, TableRow } from "../../../components/Vehicle/Table";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import Pagination from "../../../components/Pagination";
import AddMaintenanceModal from "../../../components/Modals/AddMaintenance";

const FilterModal = ({ isOpen, onClose, filters, setFilters }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end bg-black bg-opacity-50">
      <div className="h-full w-[400px] overflow-y-auto bg-white p-6 shadow-lg">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            <h2 className="text-lg font-semibold">Filters</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Vehicle ID
            </label>
            <Input
              placeholder="Enter vehicle ID"
              value={filters.vehicleId}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  vehicleId: e.target.value,
                }))
              }
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Date</label>
            <Input
              type="date"
              value={filters.date}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  date: e.target.value,
                }))
              }
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Status</label>
            <Select
              value={filters.status}
              onValueChange={(value) =>
                setFilters((prev) => ({
                  ...prev,
                  status: value,
                }))
              }
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

const MaintenanceTable = ({
  maintenanceRecords,
  currentPage,
  itemsPerPage,
}) => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedRecords = maintenanceRecords.slice(startIndex, endIndex);

  return (
    <Table
      headers={["Vehicle ID", "Date", "Type", "Description", "Cost", "Status"]}
    >
      {displayedRecords.map((record, index) => (
        <TableRow key={index}>
          <div className="border-r py-2 text-sm">{record.vehicleId}</div>
          <div className="border-r py-2 text-sm">{record.date}</div>
          <div className="border-r py-2 text-sm">{record.type}</div>
          <div className="border-r py-2 text-sm">{record.description}</div>
          <div className="border-r py-2 text-sm">${record.cost}</div>
          <div className="py-2">
            <span
              className={`rounded-full px-2 py-1 text-xs font-medium ${
                record.status === "Completed"
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
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
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    vehicleId: "",
    date: "",
    status: "all",
  });
  const [maintenanceRecords, setMaintenanceRecords] = useState([
    {
      vehicleId: "VH001",
      date: "2024-03-15",
      type: "Routine",
      description: "Oil change",
      cost: 250,
      status: "Completed",
    },
    {
      vehicleId: "VH002",
      date: "2024-04-01",
      type: "Repair",
      description: "Brake system overhaul",
      cost: 500,
      status: "In Progress",
    },
  ]);

  const itemsPerPage = 5;

  const filteredRecords = useMemo(() => {
    return maintenanceRecords.filter((record) => {
      const matchesSearch =
        record.vehicleId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesVehicleId =
        !filters.vehicleId ||
        record.vehicleId
          .toLowerCase()
          .includes(filters.vehicleId.toLowerCase());

      const matchesDate = !filters.date || record.date === filters.date;

      const matchesStatus =
        filters.status === "all" || record.status === filters.status;

      return matchesSearch && matchesVehicleId && matchesDate && matchesStatus;
    });
  }, [maintenanceRecords, searchTerm, filters]);

  const totalItems = filteredRecords.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handleAddMaintenance = (newRecord) => {
    setMaintenanceRecords((prevRecords) => [...prevRecords, newRecord]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 rounded-lg bg-white p-4 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
          <Input
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-10 border-0 bg-white pl-10 ring-1 ring-gray-200"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex h-10 items-center gap-2 border-0 bg-white px-4 ring-1 ring-gray-200"
            onClick={() => setIsFilterModalOpen(true)}
          >
            <Filter className="h-4 w-4" />
            Filters
          </Button>
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-black text-white hover:bg-slate-800"
          >
            <Plus className="mr-1 h-4 w-4" /> ADD Maintenance
          </Button>
        </div>
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
          <p className="text-lg font-semibold leading-none tracking-tight">
            Maintenance History
          </p>
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
            itemsPerPage={itemsPerPage}
            totalItems={totalItems}
            onPageChange={setCurrentPage}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default MaintenanceTab;
