// App.js
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DefaultLayout from "./layout/DefaultLayout";
import PrivateRouter from "./components/PrivateRouter";
import Dashboard from "./pages/Dashboard/Dashboard";
import AuthLayout from "./layout/AuthLayout";
import VehicleManagement from "./pages/VehicleManagement";
import DriverManagement from "./pages/DriverManagement";
import RealtimeTracking from "./pages/RealtimeTracking";
import MapComponent from "./components/MapComponent.jsx";
// import MapComponent from "./components/MapComponent.jsx";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <MapComponent />,
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
          element: <PrivateRouter allowedRoles={"ADMIN"} />,
          children: [
            {
              path: "dashboard",
              element: <Dashboard />,
            },
          ],
        },
        {
          // element: <PrivateRouter allowedRoles={"ADMIN"} />,
          children: [
            {
              path: "drive-user",
              element: <Dashboard />,
            },
            {
              path: "vehicle",
              element: <VehicleManagement />,
            },
            {
              path: "driver",
              element: <DriverManagement />,
            },
            {
              path: "realtime",
              element: <RealtimeTracking />,
            },
          ],
        },
      ],
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
