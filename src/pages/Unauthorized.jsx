import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { PageHeader } from "../components/page-header";
import { BatteryWarningIcon } from "lucide-react";

function Unauthorized() {
    const navigate = useNavigate();
    const location = useLocation();

    const params = new URLSearchParams(location.search);
    const redirect = params.get("redirect") || "/";

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate(redirect, { replace: true });
        }, 500);

        return () => clearTimeout(timer); // cleanup
    }, [navigate, redirect]);

    return (
        <div className="container mx-auto my-20">
            <div className="container mx-auto">
                <PageHeader
                icon={<BatteryWarningIcon/>}
                title={"Unauthorized - redirecting..."}
                />
            </div>
        </div>
    )
}

export default Unauthorized;
