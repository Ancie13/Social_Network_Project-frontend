import "./MainStyle.css";
import Header from "../header/Header";
import Footer from "../Components/Footer/Footer";
import { Outlet } from "react-router-dom";
import { useState } from "react";
import SearchModal from "../Components/Search/Search";

export default function MainPage() {
    const [IsSearchOpen, setIsSearchOpen] = useState(false);

    return <>
        <div className="pageLayout">
            <Header onOpenSearch={() => setIsSearchOpen(true)} />

            <div className="mainWrapper">
                <Outlet />
            </div>

            <Footer />
        </div>
        
        <SearchModal
            open={IsSearchOpen}
            onClose={() => setIsSearchOpen(false)}
        />
    </>
}