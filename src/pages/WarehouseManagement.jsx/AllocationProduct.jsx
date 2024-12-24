import React, { useState, useEffect } from 'react';
import { Package, Truck, ArrowRight, Plus, MapPin, Clock, User ,Trash } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAllWarehouses, getAllProducts, getAllRoute } from "../../services/apiRequest";
import toast from "react-hot-toast";
import axios from 'axios';
const apiKey = import.meta.env.VITE_HERE_MAP_API_KEY;

export default function AllocationProduct() {
  // Các state để lưu trữ dữ liệu 
  const [selectedWarehouse, setSelectedWarehouse] = useState(''); 
  const [selectedRoute, setSelectedRoute] = useState(''); 
  const [allocations, setAllocations] = useState([]); 
  const [warehouses, setWarehouses] = useState([]); 
  const [products, setProducts] = useState([]); 
  const [routes, setRoutes] = useState([]); 
  const [loading, setLoading] = useState(false);

  // Gọi hàm fetchWarehouses và fetchRoutes khi component được mount
  useEffect(() => {
    fetchWarehouses(); // Lấy danh sách kho
    fetchRoutes(); // Lấy danh sách tuyến đường
  }, []);


  useEffect(() => {
    if (selectedWarehouse) {
      fetchProducts(selectedWarehouse); 
    } else {
      setProducts([]); 
    }
  }, [selectedWarehouse]);

  // Hàm lấy danh sách kho từ API
  const fetchWarehouses = async () => {
    try {
      setLoading(true); 
      const data = await getAllWarehouses(); 
      setWarehouses(data); // Cập nhật danh sách kho vào state
    } catch (error) {
      toast.error("Failed to fetch warehouses"); 
      console.error("Error fetching warehouses:", error); 
    } finally {
      setLoading(false); // Tắt trạng thái loading
    }
  };

  // Hàm lấy danh sách tuyến đường từ API
  const fetchRoutes = async () => {
    try {
      setLoading(true); // Bật trạng thái loading
      const listRoute = await getAllRoute(); // Gọi API lấy danh sách tuyến đường

      // Lọc các tuyến đường có tọa độ hợp lệ
      if (listRoute && Array.isArray(listRoute) && listRoute.length > 0) {
        const validRoutes = listRoute.filter(
          (route) =>
            !isNaN(route.startLat) &&
            !isNaN(route.startLng) &&
            !isNaN(route.endLat) &&
            !isNaN(route.endLng)
        );

        // Chuyển đổi tọa độ tuyến đường thành địa chỉ 
        const routeAddressPromises = validRoutes.map(async (route) => {
          const { startLat, startLng, endLat, endLng } = route;
          const startAddress = await convertGeocode(startLat, startLng); // Lấy địa chỉ điểm bắt đầu
          const endAddress = await convertGeocode(endLat, endLng); // Lấy địa chỉ điểm kết thúc
          return { ...route, startAddress, endAddress }; 
        });

        // Chờ xử lý tất cả các tuyến đường và cập nhật vào state
        const routeAddresses = await Promise.all(routeAddressPromises);
        setRoutes(routeAddresses); 
      }
    } catch (error) {
      toast.error("Failed to fetch routes"); 
      console.error("Error fetching routes:", error); 
    } finally {
      setLoading(false); 
    }
  };

  // Hàm chuyển đổi tọa độ (latitude và longitude) thành địa chỉ
  const convertGeocode = async (lat, lng) => {
    try {
      const response = await axios.get(
        "https://revgeocode.search.hereapi.com/v1/revgeocode",
        {
          params: {
            at: `${lat},${lng}`, // Vị trí (latitude, longitude)
            lang: "en-US",
            apiKey: apiKey, // API key của HERE Map
          },
        }
      );

      if (response.data?.items?.[0]) {
        return {
          label: response.data.items[0].title || "", 
        };
      }
      return null;
    } catch (error) {
      console.error("Reverse geocoding error:", error); 
      return null;
    }
  };

  // Hàm lấy danh sách sản phẩm từ API dựa trên ID kho
  const fetchProducts = async (warehouseId) => {
    try {
      setLoading(true); // Bật trạng thái loading
      const data = await getAllProducts(warehouseId); // Gọi API lấy sản phẩm của kho
      setProducts(data); // Lưu danh sách sản phẩm vào state
    } catch (error) {
      toast.error("Failed to fetch products"); // Hiển thị thông báo lỗi
      console.error("Error fetching products:", error); // Ghi log lỗi
    } finally {
      setLoading(false); // Tắt trạng thái loading
    }
  };

  const handleAddAllocation = () => {
    setAllocations([...allocations, { productId: '', quantity: 0 }]);
  };

  const handleAllocationChange = (index, field, value) => {
    const newAllocations = [...allocations];
    const product = products.find(
      (prod) => prod.productId.toString() === newAllocations[index].productId
    );

    if (field === 'quantity' && product) {
      if (parseInt(value) > product.quantity) {
        toast.error(`Quantity exceeds available stock (${product.quantity})`);
        return;
      }
    }

    newAllocations[index][field] = value;
    setAllocations(newAllocations);
  };

  const handleRemoveAllocation = (index) => {
    const newAllocations = allocations.filter((_, i) => i !== index);
    setAllocations(newAllocations);
  };
  

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 space-y-8 max-w-7xl">
        <h1 className="text-3xl font-bold tracking-tight">Product Allocation</h1>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Warehouse and Route Selection */}
          <Card className="overflow-visible">
            <CardHeader>
              <CardTitle className="text-xl">Select Warehouse and Route</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-3">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Warehouse
                  </label>
                  <Select 
                    onValueChange={setSelectedWarehouse}
                    disabled={loading}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Warehouse" />
                    </SelectTrigger>
                    <SelectContent>
                      {warehouses.map((warehouse) => (
                        <SelectItem 
                          key={warehouse.warehouseId} 
                          value={warehouse.warehouseId.toString()}
                          className="p-2"
                        >
                          <div className="flex items-center space-x-2">
                            <Package className="h-4 w-4 text-gray-500" />
                            <span>{warehouse.warehouseName}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3 pt-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Route
                  </label>
                  <Select 
                    onValueChange={setSelectedRoute}
                    disabled={loading}
                  >
                    <SelectTrigger className="w-full min-h-[80px] h-auto whitespace-normal text-left flex items-start p-4">
                      <SelectValue placeholder="Select Route">
                        {selectedRoute && routes.find(r => r.routeId.toString() === selectedRoute) && (
                          <div className="flex flex-col space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">
                                Route {selectedRoute}
                              </span>
                            </div>
                            <div className="text-sm text-gray-600 truncate">
                              {routes.find(r => r.routeId.toString() === selectedRoute)?.startAddress?.label}
                            </div>
                          </div>
                        )}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px] overflow-y-auto w-[400px]">
                      {routes.map((route) => (
                        <SelectItem 
                          key={route.routeId} 
                          value={route.routeId.toString()}
                          className="p-4 hover:bg-gray-50 border-b last:border-b-0"
                        >
                          <div className="flex flex-col space-y-4">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">Route {route.routeId}</span>
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                route.status === 'active' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {route.status}
                              </span>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                              <div className="flex items-center space-x-2">
                                <User className="h-4 w-4 flex-shrink-0" />
                                <span className="truncate">
                                  {route.driver?.firstName} {route.driver?.lastName}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Truck className="h-4 w-4 flex-shrink-0" />
                                <span className="truncate">{route.vehicle?.licensePlate}</span>
                              </div>
                            </div>

                            <div className="space-y-3 border-t pt-3">
                              <div className="flex items-start space-x-2">
                                <MapPin className="h-4 w-4 text-green-500 flex-shrink-0 mt-1" />
                                <span className="text-sm">
                                  From: {route.startAddress?.label || 'Unknown'}
                                </span>
                              </div>
                              <div className="flex items-start space-x-2">
                                <MapPin className="h-4 w-4 text-red-500 flex-shrink-0 mt-1" />
                                <span className="text-sm">
                                  To: {route.endAddress?.label || 'Unknown'}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center text-sm text-gray-600 pt-2 border-t">
                              <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
                              <span>{route.totalTime} mins</span>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Available Products */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Available Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product Name</TableHead>
                      <TableHead>Available Quantity</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.productId}>
                        <TableCell className="font-medium">{product.productName}</TableCell>
                        <TableCell>{product.quantity}</TableCell>
                      </TableRow>
                    ))}
                    {products.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={2} className="h-24 text-center text-muted-foreground">
                          {loading ? 'Loading...' : 'Select a warehouse to view products'}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Product Allocation */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Allocate Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {allocations.map((allocation, index) => (
                <div key={index} className="flex flex-col sm:flex-row gap-4 items-center">
                  <Select
                    onValueChange={(value) =>
                      handleAllocationChange(index, 'productId', value)
                    }
                  >
                    <SelectTrigger className="w-full sm:w-[300px]">
                      <SelectValue placeholder="Select Product" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem
                          key={product.productId}
                          value={product.productId.toString()}
                        >
                          {product.productName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    placeholder="Quantity"
                    className="w-full sm:w-[120px]"
                    value={allocation.quantity}
                    onChange={(e) =>
                      handleAllocationChange(index, 'quantity', e.target.value)
                    }
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500"
                    onClick={() => handleRemoveAllocation(index)}
                  >
                    <Trash className="h-5 w-5" />
                  </Button>
                </div>
              ))}
              <Button onClick={handleAddAllocation} variant="outline" className="mt-4">
                <Plus className="mr-2 h-4 w-4" /> Add Product
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button
            onClick={() => {
              console.log({
                warehouseId: selectedWarehouse,
                routeId: selectedRoute,
                allocations,
              });
            }}
            className="w-full sm:w-auto"
            size="lg"
            disabled={!selectedWarehouse || !selectedRoute || allocations.length === 0}
          >
            <Truck className="mr-2 h-5 w-5" />
            Allocate Products
          </Button>
        </div>
      </div>
    </div>
  );
}

