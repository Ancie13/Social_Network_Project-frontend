import type { User } from "../types/Types";
import { createContext, useContext, useEffect, useState } from "react";
import { GetMe } from "./userApi";
import { connection } from "./signalR";

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

        const timer = setTimeout(async () => {
            loadUser();
        }, 300);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (!me) return;

        const startSignalR = async () => {
            try {
                if (connection.state === "Disconnected") {
                    await connection.start();
                    console.log("SignalR connected");
                }
            } catch (error) {
                console.error("SignalR connection failed:", error);
            }
        };

        startSignalR();

        return () => {
            
        };
    }, [me]);


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