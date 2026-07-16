import "./MainStyle.css";
import Header from "../header/Header";
import Footer from "../Components/Footer/Footer";
import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import SearchModal from "../Components/Search/Search";
import AddPost from "../Components/AddPost/AddPost";
import { useAuth } from "../api/AuthContext";

export default function MainPage() {
    const [IsSearchOpen, setIsSearchOpen] = useState(false);
    const [IsAddPostOpen, setIsAddPostOpen] = useState(false);
    const [isloading, setIsLoading] = useState(true);
    const { user, loading } = useAuth();
    
    // useEffect(() => {
    //     const fetchUser = async () => {
    //         const user = await GetMe();
    //         setUser(user);
    //     };
    //     fetchUser();
    // }, []);

    useEffect(() => {
        if(user)
        {
            document.documentElement.style.setProperty(
                "--race-color",
                user.race.themeColorHex
            );
        }

        setIsLoading(false);
    }, [user]);
    

    if(loading || isloading) {
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