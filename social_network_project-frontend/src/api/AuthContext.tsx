import type { User } from "../types/Types";
import { createContext, useContext, useEffect, useState } from "react";
import { GetMe } from "./userApi";

interface AuthContextType {
    me: User | null;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode })
{
    const [me, setMe] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        async function loadUser()
        {
            try
            {
                const user = await GetMe();
                setMe(user);
            }
            catch(error)
            {
                console.error(error);
                setMe(null);
            }
            finally
            {
                setLoading(false);
            }
        }

        loadUser();
    }, []);


    return (
        <AuthContext.Provider value={{ me, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth()
{
    const context = useContext(AuthContext);

    if (!context)
    {
        throw new Error("useAuth must be inside AuthProvider");
    }

    return context;
}