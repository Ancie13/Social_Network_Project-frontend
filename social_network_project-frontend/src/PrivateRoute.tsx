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
    const { me, loading } = useAuth();


    if (loading)
    {
        return <Loader />;
    }


    if (!me)
    {
        return <Navigate to="/" replace />;
    }


    return children;
}