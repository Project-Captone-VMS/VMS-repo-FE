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
          element: <PrivateRouter allowedRoles={"ADMIN"} />,
          children: [
            {
              path: "dashboard",
              element: <Dashboard />,
            },
          ],
        },
        {
          element: <PrivateRouter allowedRoles={"USER"} />,
          children: [
            {
              path: "driveuser",
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
