import React, { useState,useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, Search, ArrowLeft,Warehouse,MapPin,User,Package,Layers,PercentSquare,Calendar} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { AddProduct } from"../../components/Modals/AddProduct";
import { EditProduct } from"../../components/Modals/EditProduct";
import { ProductTable } from '../../components/Warehouse/ProductTable';
import { getAllProducts, deleteProduct } from "../../services/apiRequest";
import Swal from "sweetalert2";

const WarehouseProduct = () => {
    const { warehouseId } = useParams();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddProductOpen, setIsAddProductOpen] = useState(false);
    const [isEditProductOpen, setIsEditProductOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [products, setProducts] = useState([]);
    const [warehouse, setWarehouse] = useState({
        warehouseId: '',
        location: '',
        capacity: 0,
        currentStock: 0,
        status: 'inactive',
        utilizationRate: 0,
        lastUpdated: new Date().toISOString().split('T')[0]
    });

    const fetchWarehouseData = async () => {
        try {
            const data = await getWarehouseById(warehouseId);
            const utilizationRate = data.capacity > 0 
                ? ((data.currentStock / data.capacity) * 100).toFixed(1) 
                : 0;
            
            setWarehouse({
                ...data,
                utilizationRate: Number(utilizationRate),
                status: data.currentStock < data.capacity ? 'active' : 'full',
                lastUpdated: data.lastUpdated || new Date().toISOString().split('T')[0]
            });
        } catch (error) {
            console.error("Error fetching warehouse:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Failed to fetch warehouse information. Please try again.',
            });
        }
    };

    const fetchProducts = async () => {
        try {
            const data = await getAllProducts(warehouseId);
            setProducts(data);
        } catch (error) {
            console.error("Error fetching products:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Failed to fetch products. Please try again.',
            });
        }
    };

    useEffect(() => {
        fetchWarehouseData();
        fetchProducts();
    }, [warehouseId]);

    const handleAddProduct = (product) => {
        setProducts([...products, product]);
        setIsAddProductOpen(false);
        Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'Product added successfully.',
        });
    };

    const handleEditProduct = (product) => {
        setEditingProduct(product);
        setIsEditProductOpen(true);
    };

    const handleUpdateProduct = (updatedProduct) => {
        setProducts(products.map(p => 
            p.id === updatedProduct.id ? updatedProduct : p
        ));
        setIsEditProductOpen(false);
        setEditingProduct(null);
        Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'Product updated successfully.',
        });
    };

    const handleDeleteProduct = async (productId) => {
        const confirmResult = await Swal.fire({
            title: "Are you sure?",
            text: `Do you want to delete product ${productId}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "No, cancel!",
        });

        if (confirmResult.isConfirmed) {
            try {
                await deleteProduct(productId);
                setProducts(products.filter(p => p.id !== productId));
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Product deleted successfully.',
                });
            } catch (error) {
                console.error("Error deleting product:", error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: 'Failed to delete the product. Please try again.',
                });
            }
        }
    };

    const filteredProducts = products.filter(product =>
        product.warehouseId === warehouseId &&
        (product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
         product.category?.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="max-w-8xl mx-auto px-4 py-8">
            <Button
                variant="ghost"
                className="mb-6 hover:bg-gray-100 transition-colors duration-200"
                onClick={() => navigate('/warehouse')}
            >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
            </Button>

            <Card className="mb-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div className="flex items-center space-x-3">
                            <Warehouse className="h-8 w-8 text-blue-500" />
                            <div>
                                <CardTitle className="text-2xl font-bold text-gray-800">
                                    Warehouse {warehouse.warehouseId}
                                </CardTitle>
                                <p className="text-gray-500 text-sm mt-1">
                                    ID: {warehouse.warehouseId}
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                            <Badge 
                                variant={warehouse.status === 'active' ? 'success' : 'secondary'}
                                className="capitalize px-3 py-1"
                            >
                                {warehouse.status}
                            </Badge>
                            <span className="text-sm text-gray-500 flex items-center">
                                <Calendar className="h-4 w-4 mr-1" />
                                Last updated: {warehouse.lastUpdated}
                            </span>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                            <div className="flex items-center space-x-2 text-gray-600 mb-2">
                                <MapPin className="h-5 w-5" />
                                <p>Location</p>
                            </div>
                            <p className="font-semibold text-gray-800">{warehouse.location}</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                            <div className="flex items-center space-x-2 text-gray-600 mb-2">
                                <Layers className="h-5 w-5" />
                                <p>Capacity</p>
                            </div>
                            <p className="font-semibold text-gray-800">
                                {warehouse.capacity.toLocaleString()} units
                            </p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                            <div className="flex items-center space-x-2 text-gray-600 mb-2">
                                <Package className="h-5 w-5" />
                                <p>Current Stock</p>
                            </div>
                            <p className="font-semibold text-gray-800">
                                {warehouse.currentStock.toLocaleString()} units
                            </p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                            <div className="flex items-center space-x-2 text-gray-600 mb-2">
                                <PercentSquare className="h-5 w-5" />
                                <p>Utilization</p>
                            </div>
                            <p className="font-semibold text-gray-800">{warehouse.utilizationRate}%</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="shadow-lg">
                <CardHeader>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                        <div className="flex items-center space-x-2">
                            <Package className="h-6 w-6 text-blue-500" />
                            <CardTitle>Products</CardTitle>
                        </div>
                        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 w-full md:w-auto">
                            <div className="relative flex-grow md:flex-grow-0 md:w-64">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Search products..."
                                    className="pl-10 w-full"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <Button 
                                onClick={() => setIsAddProductOpen(true)}
                                className="bg-blue-500 hover:bg-blue-600 text-white transition-colors duration-200"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Product
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <ProductTable
                        products={filteredProducts}
                        onEdit={handleEditProduct}
                        onDelete={handleDeleteProduct}
                    />
                </CardContent>
            </Card>

            <AddProduct
                isOpen={isAddProductOpen}
                onClose={() => setIsAddProductOpen(false)}
                onSubmit={handleAddProduct}
                warehouseId={warehouseId}
            />

            {editingProduct && (
                <EditProduct
                    isOpen={isEditProductOpen}
                    onClose={() => {
                        setIsEditProductOpen(false);
                        setEditingProduct(null);
                    }}
                    onSubmit={handleUpdateProduct}
                    product={editingProduct}
                    warehouseId={warehouseId}
                />
            )}
        </div>
    );
};

export default WarehouseProduct;