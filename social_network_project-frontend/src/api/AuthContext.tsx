import type { User } from "../types/Types";
import { createContext, useContext, useEffect, useState } from "react";
import { GetMe } from "./userApi";

interface AuthContextType {
    user: User | null;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode })
{
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        async function loadUser()
        {
            try
            {
                const user = await GetMe();
                setUser(user);
            }
            catch(error)
            {
                console.error(error);
                setUser(null);
            }
            finally
            {
                setLoading(false);
            }
        }

        loadUser();
    }, []);


    return (
        <AuthContext.Provider value={{ user, loading }}>
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