import "./MainStyle.css";
import Header from "../header/Header";
import Footer from "../Components/Footer/Footer";
import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import SearchModal from "../Components/Search/Search";
import AddPost from "../Components/AddPost/AddPost";
import type { User } from "../types/Types";
import { GetMe } from "../api/userApi";

export default function MainPage() {
    const [IsSearchOpen, setIsSearchOpen] = useState(false);
    const [IsAddPostOpen, setIsAddPostOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);
    
    useEffect(() => {
        const fetchUser = async () => {
            const user = await GetMe();
            setUser(user);
        };
        fetchUser();
    }, []);

    useEffect(() => {
        if(user)
        {
            document.documentElement.style.setProperty(
                "--race-color",
                user.race.themeColorHex
            );
        }

        setLoading(false);
    }, [user]);
    

    if(loading) {
        return <div>Loading...</div>;
    }
    return <>
        <div className="pageLayout">
            <Header 
                onOpenSearch={() => setIsSearchOpen(true)}
                onOpenAddPost={() => setIsAddPostOpen(true)} 
             />

            <div className="mainWrapper">
                <Outlet />
            </div>

            <Footer />
        </div>
        
        <SearchModal
            open={IsSearchOpen}
            onClose={() => setIsSearchOpen(false)}
        />
        <AddPost
            open={IsAddPostOpen}
            onClose={() => setIsAddPostOpen(false )}
        />
    </>
}