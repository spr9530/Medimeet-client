import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { useUserContext } from "../userContext/userContext";
import LoadingScreen from "../components/loading";

export default function ProtectedRoute({ allowedRoles = [] }) {
  const location = useLocation();
  const { userRole, userSignedIn, userLoading } = useUserContext();
  
  if(userLoading){
    return (
      <LoadingScreen />
    )
  }

  // If not signed in, redirect
  if (!userSignedIn) {
    return (
      <Navigate
        to={`/sign-in?redirect=${location.pathname}`}
        replace
      />
    );
  }

  // If role not allowed
  else if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized?redirect=/" replace />;
  }

   else return <Outlet />;
}
