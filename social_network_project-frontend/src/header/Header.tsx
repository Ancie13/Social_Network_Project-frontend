import "./HeaderStyle.css";
import logo from "../assets/logo_holder.png";
import { Avatar, Button, Input, Tabs } from "antd";
import { useEffect, useState } from "react";
import {
    HomeFilled,
    HomeOutlined,
    LikeFilled,
    LikeOutlined,
    MessageFilled,
    MessageOutlined,
    PlusOutlined,
    StarFilled,
    StarOutlined,
} from "@ant-design/icons";
import ThemeToggle from "../Components/Theme/ThemeToggle";
import { Link, useLocation } from "react-router-dom";
import type { User } from "../types/Types";

export default function Header({ onOpenSearch, onOpenAddPost })
{
    const location = useLocation();
    const user = JSON.parse(sessionStorage.getItem("user") || "null") as User;

    const activeTab = (() => {
        if (location.pathname === "/home") return "home";
        if (location.pathname === "/messages") return "messages";
        if (location.pathname === "/likes") return "likes";
        if (location.pathname === "/saved") return "saved";
        return "";
    })();
    const [showHeader, setShowHeader] = useState(true);

    let lastScrollY = 0;

    useEffect(() => {
        document.documentElement.style.setProperty(
            "--header-offset",
            showHeader ? "120px" : "0px"
        );
    }, [showHeader]);
    
    useEffect(() =>
    {
        const handleScroll = () =>
        {
            const currentY = window.scrollY;

            if (currentY > lastScrollY)
            {
                setShowHeader(false);
            }
            else
            {
                setShowHeader(true);
            }

            lastScrollY = currentY;
        };

        window.addEventListener("scroll", handleScroll);

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const items = [
        {
            key: "home",
            label: (
                <Link to="/home">
                    <div className="tabItem">
                        {activeTab === "home" ? <HomeFilled /> : <HomeOutlined />}
                        <span className="tabText">Home</span>
                    </div>
                </Link>
            )
        },
        {
            key: "messages",
            label: (
                <Link to="/messages">
                    <div className="tabItem">
                        {activeTab === "messages" ? <MessageFilled /> : <MessageOutlined />}
                        <span className="tabText">Messages</span>
                    </div>
                </Link>
            )
        },
        {
            key: "likes",
            label: (
                <Link to="/likes">
                    <div className="tabItem">
                        {activeTab === "likes" ? <LikeFilled /> : <LikeOutlined />}
                        <span className="tabText">Likes</span>
                    </div>
                </Link>
            )
        },
        {
            key: "saved",
            label: (
                <Link to="/saved">
                    <div className="tabItem">
                        {activeTab === "saved" ? <StarFilled /> : <StarOutlined />}
                        <span className="tabText">Saved</span>
                    </div>
                </Link>
                
            )
        },
    ];

    return <>
        <div className="pageBox">

            <div className={`wrapperHeader ${showHeader ? "show" : "hide"}`}>

                <Link to="/home">
                    <img src={logo} alt="logo" className="logoHeader" />
                </Link>

                <div className="searchBox">
                    <Input
                        placeholder="Search..."
                        className="searchInput"
                        onClick={onOpenSearch}
                        readOnly
                    />
                </div>
                <div className="btnsBox">
                    <ThemeToggle />
                    <Tabs
                        className="customTabs"
                        items={items}
                        activeKey={activeTab}
                    />
                </div>
                <div className="profileBtnsGroup">
                    <Button
                        className="addPostBtn"
                        type="primary"
                        shape="circle"
                        icon={<PlusOutlined />}
                        onClick={onOpenAddPost}
                    />
                    <Link to="/profile">
                        <Button
                            className="profileBtn"
                            type="text"
                        >
                            <Avatar
                                size={40}
                                src={user.imageUrl || logo}
                            />
                            <div className="profileText">Profile</div>
                            
                        </Button>
                    </Link>
                </div>
                
                

            </div>
            
            
        </div>
    </>
}