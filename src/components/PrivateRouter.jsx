import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRouter = ({ allowedRoles }) => {
  const currentUser = useSelector((state) => state.auth.login.currentUser);
  const role = useSelector(
    (state) => state.auth.login.currentUser?.result.roles[0]
  );

  const userRole = localStorage.getItem("userRole");


  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/dashboard" />;
  }

  return <Outlet />;
};

export default PrivateRouter;
