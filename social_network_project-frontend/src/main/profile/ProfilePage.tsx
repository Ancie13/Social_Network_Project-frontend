import "./ProfileStyle.css";
import { Navigate } from "react-router-dom";
import Loader from "../../Components/loader/Loader";
import { useAuth } from "../../api/AuthContext";


export default function ProfilePage()
{
    const { me, loading } = useAuth();

    if (loading) {
        return <Loader/>;
    }

    return <Navigate to={`/profile/${me.login}`} replace />;
}