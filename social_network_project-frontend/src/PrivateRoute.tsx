import { Navigate } from "react-router-dom";
import { useAuth } from "./api/AuthContext";
import Loader from "./Components/loader/Loader";


export default function PrivateRoute(
    {
        children
    }: 
    {
        children: React.ReactNode
    }
)
{
    const { user, loading } = useAuth();


    if (loading)
    {
        return <Loader />;
    }


    if (!user)
    {
        return <Navigate to="/" replace />;
    }


    return children;
}