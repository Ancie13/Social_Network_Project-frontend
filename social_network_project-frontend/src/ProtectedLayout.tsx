import { Outlet } from "react-router-dom";
import { AuthProvider } from "./api/AuthContext";
import PrivateRoute from "./PrivateRoute";


export default function ProtectedLayout()
{
    return (
        <AuthProvider>
            <PrivateRoute>
                <Outlet />
            </PrivateRoute>
        </AuthProvider>
    );
}