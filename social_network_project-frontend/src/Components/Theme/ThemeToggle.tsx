import { useEffect, useState } from "react";
import { Button } from "antd";
import { MoonOutlined, SunOutlined } from "@ant-design/icons";
import "./ThemeToggleStyle.css";

export default function ThemeToggle()
{
    const [theme, setTheme] = useState<"dark" | "light">("dark");

    useEffect(() =>
    {
        document.body.classList.toggle("light-theme", theme === "light");
    }, [theme]);

    const toggleTheme = () =>
    {
        setTheme(prev => (prev === "dark" ? "light" : "dark"));
    };

    return (
        <Button
            className={`themeBtn ${theme}`}
            type="text"
            shape="circle"
            icon={theme === "dark" ? <MoonOutlined /> : <SunOutlined />}
            onClick={toggleTheme}
        />
    );
}