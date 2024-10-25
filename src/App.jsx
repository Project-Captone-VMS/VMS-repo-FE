// App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Layouts/Header';
import Sidebar from './components/Layouts/Sidebar';
import DriverManagement from './page/DriverManagement';
import VehicleManagement from './page/VehicleManagement';
import AddVehicleModal from './components/Modals/AddVehicleModal';
import EditVehicleModal from './components/Modals/EditVehicleModal';


// Tạo các components tạm thời cho các trang
const RoutePlanning = () => <div className="p-4">Route Planning Page</div>;
const WarehouseManagement = () => <div className="p-4">Warehouse Management Page</div>;
const Analytics = () => <div className="p-4">Analytics Page</div>;
const InternalChat = () => <div className="p-4">Internal Chat Page</div>;
const Reports = () => <div className="p-4">Reports Page</div>;

const Layout = ({ children }) => {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-100 dark:bg-gray-950">
      {/* Sidebar - Fixed */}
      <div className="fixed left-0 top-0 h-full z-30">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 ml-64"> {/* ml-64 matches Sidebar width */}
        {/* Header - Fixed */}
        <div className="fixed top-0 right-0 left-64 z-20">
          <Header />
        </div>

        {/* Main Content with Scroll */}
        <main className="flex-1 p-6 mt-16 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/vehicle" replace />} />
          <Route path="/vehicle/create" element={<AddVehicleModal />} />
          <Route path="/vehicle/update/:vehicleId" element={<EditVehicleModal />} />
          <Route path="/vehicle" element={<VehicleManagement />} />
          <Route path="/driver" element={<DriverManagement />} />
          <Route path="/route" element={<RoutePlanning />} />
          <Route path="/warehouse" element={<WarehouseManagement />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/chat" element={<InternalChat />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;

