// App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import DriverManagement from './page/DriverManagement';
import VehicleManagement from './page/VehicleManagement';


// Tạo các components tạm thời cho các trang
const RoutePlanning = () => <div className="p-4">Route Planning Page</div>;
const WarehouseManagement = () => <div className="p-4">Warehouse Management Page</div>;
const Analytics = () => <div className="p-4">Analytics Page</div>;
const InternalChat = () => <div className="p-4">Internal Chat Page</div>;
const Reports = () => <div className="p-4">Reports Page</div>;

const Layout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6">
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
          <Route path="/" element={<Navigate to="/driver" replace />} />
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
// import React from 'react';
// import VehicleManagement from './page/VehicleManagement';

// const App = () => {
//   return (
//     <div>
//       <VehicleManagement />
//     </div>
//   );
// };

// export default App;
