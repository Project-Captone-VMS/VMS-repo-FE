import {createBrowserRouter,RouterProvider,Navigate} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DefaultLayout from "./layout/DefaultLayout";
import PrivateRouter from "./components/PrivateRouter";
import Dashboard from "./pages/Dashboard";
import AuthLayout from "./layout/AuthLayout";
import VehicleManagement from "./pages/VehicleManegement/VehicleManagement";
import DriverManagement from "./pages/DriverManagement/DriverManagement";
import RealtimeTracking from "./pages/RealtimeTracking/RealtimeTracking";
import UpdateDriver from "./components/Modals/UpdateDriver";
import OverviewTab from "./pages/VehicleManegement/sub-pages/OverviewTab";
import VehiclesTab from "./pages/VehicleManegement/sub-pages/VehiclesTab";
import MaintenanceTab from "./pages/VehicleManegement/sub-pages/MaintenanceTab";
import WarehouseManagement from "./pages/WarehouseManagement.jsx/WarehouseManagement";
import WarehouseProduct from "./pages/WarehouseManagement.jsx/WarehouseProduct";
import Analytics from "./pages/AnalyticsManagement/Analytics";
import ProfileInformation from "./pages/Profileinformation";
import IndexRoute from "./pages/Route/IndexRoute";
import OverviewRoute from "./pages/Route/sub-Route/OverviewRoute";
import ListRoute from "./pages/Route/sub-Route/ListRoute";
import InvoicePage from "./pages/WarehouseManagement.jsx/InvoicePage";
import IncidentTab from "./pages/VehicleManegement/sub-pages/IncidentTab";
import ExpenseManagement from "./pages/ExpenseManagement";
import AdminSender from "./pages/SendNotification/AdminSender";
import UserReceiver from "./pages/SendNotification/UserReceiver";
import RouteDetailUser from "./pages/RouteDetailUser";
import MovementMap from "./pages/RealtimeTracking/MovementMap";
import RealtimeTrackingDashboard from "./pages/RealtimeTracking/TrackingUser";

import { Toaster } from "react-hot-toast";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Login />,
    },
    {
      element: <AuthLayout />,
      children: [
        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/register",
          element: <Register />,
        },
      ],
    },
    {
      element: <DefaultLayout />,
      children: [
        {
          element: <PrivateRouter allowedRoles={"USER"} />,
          children: [
            {
              path: "driveuser",
              element: <Dashboard />,
            },
            {
              path: "realtime",
              element: <RealtimeTrackingDashboard />,
            },
            {
              path: "movement",
              element: <MovementMap />,
            },
            {
              path: "profile",
              element: <ProfileInformation />,
            },
            {
              path: "UserReceiver",
              element: <UserReceiver />,
            },
            {
              path: "routeDetail",
              element: <RouteDetailUser />,
            },
          ],
        },
        {
          element: <PrivateRouter allowedRoles={"ADMIN"} />,
          children: [
            {
              path: "dashboard",
              element: <Dashboard />,
            },
            {
              path: "profile",
              element: <ProfileInformation />,
            },
            {
              path: "realtime",
              element: <RealtimeTracking />,
            },
            {
              path: "vehicle",
              element: <VehicleManagement />,
              children: [
                {
                  path: "",
                  element: <Navigate to="OverviewTab" replace />,
                },
                {
                  path: "OverviewTab",
                  element: <OverviewTab />,
                },
                {
                  path: "VehiclesTab",
                  element: <VehiclesTab />,
                },
                {
                  path: "MaintenanceTab",
                  element: <MaintenanceTab />,
                },
                {
                  path: "IncidentTab",
                  element: <IncidentTab />,
                },
              ],
            },
            {
              path: "driver",
              element: <DriverManagement />,
            },
            {
              path: "driver/update/:id",
              element: <UpdateDriver />,
            },
            {
              path: "expenses",
              element: <ExpenseManagement />,
            },
            {
              path: "warehouse",
              element: <WarehouseManagement />,
            },
            {
              path: "warehouse/:warehouseId",
              element: <WarehouseProduct />,
            },
            {
              path: "warehouse/:warehouseId/invoices",
              element: <InvoicePage />,
            },
            {
              path: "Analytics",
              element: <Analytics />,
            },

            {
              path: "indexNotification",
              element: <AdminSender />,
            },
            {
              path: "route",
              element: <IndexRoute />,
              children: [
                {
                  path: "",
                  element: <Navigate to="overviewRoute" replace />,
                },
                {
                  path: "overviewRoute",
                  element: <OverviewRoute />,
                },
                {
                  path: "listRoute",
                  element: <ListRoute />,
                },
              ],
            },
          ],
        },
      ],
    },
  ]);

  return (
    <>
      <Toaster />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
