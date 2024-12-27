import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Truck, MapPin, User, Package, Trash } from "lucide-react";
import {
  getAllWarehouses,
  getAllRoute,
  getAllItems,
} from "../../services/apiRequest";
import axios from "axios";
import Pagination from "@/components/Pagination";
const apiKey = import.meta.env.VITE_HERE_MAP_API_KEY;

const ShipmentTable = ({ shipments, onDelete, onUpdateStatus }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2; // 2 items per page
  const [warehousesData, setWarehousesData] = useState({});
  const [routesData, setRoutesData] = useState({});
  const [itemsData, setItemsData] = useState({});
  const [loading, setLoading] = useState(true);

  // Calculate pagination
  const filteredShipments = shipments; // Add filters if needed
  const totalPages = Math.ceil(filteredShipments.length / itemsPerPage);
  const paginatedShipments = filteredShipments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    fetchRelatedData();
  }, [shipments]);

  const convertGeocode = async (lat, lng) => {
    try {
      const response = await axios.get(
        "https://revgeocode.search.hereapi.com/v1/revgeocode",
        {
          params: {
            at: `${lat},${lng}`,
            lang: "en-US",
            apiKey: apiKey,
          },
        },
      );

      if (response.data?.items?.[0]) {
        return {
          label: response.data.items[0].title || "",
        };
      }
      return null;
    } catch (error) {
      console.log("Reverse geocoding error:", error);
      return null;
    }
  };

  const fetchItems = async (warehouseId) => {
    try {
      const items = await getAllItems(warehouseId);
      console.log(`Items for warehouse ${warehouseId}:`, items);
      return items;
    } catch (error) {
      console.error(
        `Error fetching items for warehouse ${warehouseId}:`,
        error,
      );
      return [];
    }
  };

  const fetchRelatedData = async () => {
    try {
      setLoading(true);

      // Fetch warehouses data
      const warehousesResponse = await getAllWarehouses();
      // console.log("Warehouses Response:", warehousesResponse);
      const warehousesMap = {};
      warehousesResponse.forEach((warehouse) => {
        warehousesMap[warehouse.warehouseId] = warehouse;
      });
      setWarehousesData(warehousesMap);

      // Fetch routes data and use stored location names
      const routesResponse = await getAllRoute();
      const routesMap = {};
      routesResponse.forEach(route => {
        routesMap[route.routeId] = {
          ...route,
          startAddress: { label: route.startLocationName },
          endAddress: { label: route.endLocationName }
        };
      });
      console.log("Routes Map:", routesMap);
      setRoutesData(routesMap);

      // Fetch items for each warehouse
      const itemsMap = {};
      for (const shipment of shipments) {
        if (shipment.warehouse?.warehouseId) {
          const warehouseItems = await fetchItems(
            shipment.warehouse.warehouseId,
          );
          itemsMap[shipment.warehouse.warehouseId] = warehouseItems;
        }
      }
      setItemsData(itemsMap);
    } catch (error) {
      console.error("Error fetching related data:", error);
      toast.error("Failed to fetch complete data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Warehouse</TableHead>
            <TableHead>Route Details</TableHead>
            <TableHead>Driver Info</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedShipments.map((shipment) => {
            const warehouse = warehousesData[shipment.warehouse?.warehouseId];
            const route = routesData[shipment.route?.routeId];

            return (
              <TableRow key={shipment.shipmentId}>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Package className="h-4 w-4 text-gray-500" />
                    <span>{warehouse?.warehouseName || "N/A"}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col space-y-1">
                    <div className="flex items-center text-sm">
                      <MapPin className="mr-1 h-4 w-4 text-green-500" />
                      <span className="text-gray-600">
                        From: {route?.startLocationName|| "Loading..."}
                      </span>
                    </div>
                    <div className="flex items-center text-sm">
                      <MapPin className="mr-1 h-4 w-4 text-red-500" />
                      <span className="text-gray-600">
                        To: {route?.endLocationName || "Loading..."}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col space-y-1">
                    <div className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      <span>
                        {route?.driver?.firstName} {route?.driver?.lastName}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Truck className="mr-2 h-4 w-4" />
                      <span>{route?.vehicle?.licensePlate}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-2">
                    {itemsData[shipment.warehouse?.warehouseId]?.map((item) => (
                      <div
                        key={item.itemId}
                        className="border-b pb-2 last:border-0"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{item.itemName}</span>
                          {/* <span className="text-gray-500">ID: {item.itemId}</span> */}
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Quantity: {item.quantity}</span>
                          <span>Price: ${item.price.toFixed(2)}</span>
                        </div>
                        <div className="text-right text-sm font-medium text-blue-600">
                          Total: ${(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={shipment.status ? "Complete" : "No Complete"}>
                    {shipment.status ? "Complete" : "No Complete"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(shipment.shipmentId)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <div className="mt-4">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          totalItems={filteredShipments.length}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default ShipmentTable;