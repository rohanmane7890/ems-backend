import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/AuthService";

function Logout() {

    const navigate = useNavigate();

    useEffect(() => {

        AuthService.logout();

        navigate("/");

    }, [navigate]);

    return (
        <div className="container text-center mt-5">
            <h3>Logging out...</h3>
        </div>
    );
}

export default Logout;
