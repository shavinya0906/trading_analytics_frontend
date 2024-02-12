import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
    const isLoading=useSelector((state)=>state?.auth?.isLoading)
    const token = useSelector((state) => state?.auth?.token);
    return isLoading?"Loading":token ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
