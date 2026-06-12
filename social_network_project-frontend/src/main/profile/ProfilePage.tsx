import "./ProfileStyle.css";
import type { User } from "../../types/Types";
import { Navigate } from "react-router-dom";


export default function ProfilePage()
{
    const user = JSON.parse(sessionStorage.getItem("user")) as User;

    return <Navigate to={`/profile/${user.login}`} replace />;
}