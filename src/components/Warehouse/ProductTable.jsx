import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Button } from "../../components/ui/button"; 
import { Package, Edit, Trash2 } from 'lucide-react';

export const ProductTable = ({ products, onEdit, onDelete }) => {
  // Add validation for products prop
  if (!Array.isArray(products)) {
      console.error('Products must be an array');
      return null;
  }

  const handleEdit = (product) => {
      // Ensure all required fields are present before calling onEdit
      const validProduct = {
          id: product.id || product.productId, // Handle both id formats
          productName: product.productName,
          price: typeof product.price === 'number' ? product.price : parseFloat(product.price) || 0,
          quantity: typeof product.quantity === 'number' ? product.quantity : parseInt(product.quantity) || 0,
          warehouse_id: product.warehouse?.warehouse_id || product.warehouseId
      };

      console.log('Editing product:', validProduct); // Debug log
      onEdit(validProduct);
  };

  const handleDelete = (productId) => {
      // Use either id or productId, depending on what's available
      const id = productId || product.id;
      if (id) {
          onDelete(id);
      } else {
          console.error('No valid product ID found for deletion');
      }
  };

  return (
      <Table>
          <TableHeader>
              <TableRow>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Warehouse</TableHead>
                  <TableHead>Actions</TableHead>
              </TableRow>
          </TableHeader>
          <TableBody>
              {products.map((product) => (
                  <TableRow key={product.id || product.productId}>
                      <TableCell>
                          <div className="flex items-center">
                              <div className="h-10 w-10 flex-shrink-0 bg-gray-100 rounded-lg flex items-center justify-center">
                                  <Package className="h-5 w-5 text-gray-600" />
                              </div>
                              <div className="ml-4">
                                  <div className="font-medium">{product.productName}</div>
                              </div>
                          </div>
                      </TableCell>
                      <TableCell>
                          ${(typeof product.price === 'number' ? product.price : parseFloat(product.price) || 0).toFixed(2)}
                      </TableCell>
                      <TableCell>
                          {typeof product.quantity === 'number' ? product.quantity : parseInt(product.quantity) || 0}
                      </TableCell>
                      <TableCell>
                          {product.warehouse?.warehouse_id || product.warehouseId || 'N/A'}
                      </TableCell>
                      <TableCell>
                          <div className="flex space-x-2">
                              <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => handleEdit(product)}
                              >
                                  <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => handleDelete(product.id || product.productId)}
                              >
                                  <Trash2 className="h-4 w-4" />
                              </Button>
                          </div>
                      </TableCell>
                  </TableRow>
              ))}
          </TableBody>
      </Table>
  );
};

export default ProductTable;