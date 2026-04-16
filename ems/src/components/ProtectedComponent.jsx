import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {

    const userRole = localStorage.getItem("role");

    // If not logged in
    if (!userRole) {
        return <Navigate to="/" replace />;
    }

    // If role does not match
    if (role && userRole !== role) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
