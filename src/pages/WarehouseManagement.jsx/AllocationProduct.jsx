import React, { useState, useEffect } from 'react';
import { Package, Truck, ArrowRight, Plus } from 'lucide-react';
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

// Mock data - replace with actual API calls
const mockWarehouses = [
  { id: 1, name: 'Warehouse A' },
  { id: 2, name: 'Warehouse B' },
];

const mockProducts = [
  { id: 1, name: 'Product 1', quantity: 100 },
  { id: 2, name: 'Product 2', quantity: 150 },
];

const mockRoutes = [
  { id: 1, name: 'Route 1', start: 'City A', end: 'City B' },
  { id: 2, name: 'Route 2', start: 'City C', end: 'City D' },
];

export default function AllocationProduct() {
  const [selectedWarehouse, setSelectedWarehouse] = useState('');
  const [selectedRoute, setSelectedRoute] = useState('');
  const [allocations, setAllocations] = useState([]);

  const handleAddAllocation = () => {
    // Logic to add a new allocation
    setAllocations([...allocations, { productId: '', quantity: 0 }]);
  };

  const handleAllocationChange = (index, field, value) => {
    const newAllocations = [...allocations];
    newAllocations[index][field] = value;
    setAllocations(newAllocations);
  };

  const handleSubmitAllocation = () => {
    // Logic to submit the allocation
    console.log('Submitting allocation:', { selectedWarehouse, selectedRoute, allocations });
    // Here you would typically make an API call to save the allocation
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-3xl font-bold">Product Allocation</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Select Warehouse and Route</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select onValueChange={setSelectedWarehouse}>
              <SelectTrigger>
                <SelectValue placeholder="Select Warehouse" />
              </SelectTrigger>
              <SelectContent>
                {mockWarehouses.map((warehouse) => (
                  <SelectItem key={warehouse.id} value={warehouse.id.toString()}>
                    {warehouse.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select onValueChange={setSelectedRoute}>
              <SelectTrigger>
                <SelectValue placeholder="Select Route" />
              </SelectTrigger>
              <SelectContent>
                {mockRoutes.map((route) => (
                  <SelectItem key={route.id} value={route.id.toString()}>
                    {route.name} ({route.start} <ArrowRight className="inline h-4 w-4" /> {route.end})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Available Products</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Available Quantity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.quantity}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Allocate Products</CardTitle>
        </CardHeader>
        <CardContent>
          {allocations.map((allocation, index) => (
            <div key={index} className="mb-4 flex items-center space-x-4">
              <Select
                onValueChange={(value) => handleAllocationChange(index, 'productId', value)}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select Product" />
                </SelectTrigger>
                <SelectContent>
                  {mockProducts.map((product) => (
                    <SelectItem key={product.id} value={product.id.toString()}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="number"
                placeholder="Quantity"
                className="w-[100px]"
                value={allocation.quantity}
                onChange={(e) => handleAllocationChange(index, 'quantity', e.target.value)}
              />
            </div>
          ))}
          <Button onClick={handleAddAllocation} className="mt-2">
            <Plus className="mr-2 h-4 w-4" /> Add Product
          </Button>
        </CardContent>
      </Card>

      <div className="mt-6 flex justify-end">
        <Button onClick={handleSubmitAllocation} className="bg-blue-500 text-white">
          <Truck className="mr-2 h-4 w-4" /> Allocate Products
        </Button>
      </div>
    </div>
  );
}

