import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRouter = ({ allowedRoles }) => {
  const currentUser = useSelector((state) => state.auth.login.currentUser);
  const role = useSelector(
    (state) => state.auth.login.currentUser?.result.roles[0]
  );

  if (!currentUser) {
    return <Navigate to="/drive" />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/dashboard" />;
  }

  return <Outlet />;
};

export default PrivateRouter;
