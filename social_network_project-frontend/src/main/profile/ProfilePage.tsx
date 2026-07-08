import "./ProfileStyle.css";
import type { User } from "../../types/Types";
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { GetMe } from "../../api/userApi";
import Loader from "../../Components/loader/Loader";


export default function ProfilePage()
{
    const [user, setUser] = useState<User | null>(null);
    

    useEffect(() => {
        const fetchUser = async () => {
            const user = await GetMe();
            setUser(user);
        };
        fetchUser();
    }, []);

    if (!user) {
        return <Loader/>;
    }

    return <Navigate to={`/profile/${user.login}`} replace />;
}