import { useState } from "react";
import "./HomeStyle.css";
import { Button } from "antd";
import Post from "../../Components/Post";
import preview from "../../assets/Preview.webp";


export default function HomeContent() 
{
    const [active, setActive] = useState<"first" | "second">("first");

    return <>
        <div className="homeContainer">
            <div className="menuContainer">
                <Button
                    className={`menuItem ${active === "first" ? "active" : ""}`}
                    onClick={() => setActive("first")}
                >
                    Option 1
                </Button>

                <Button
                    className={`menuItem ${active === "second" ? "active" : ""}`}
                    onClick={() => setActive("second")}
                >
                    Option 2
                </Button>
            </div>
            <div className="postsConteiner">
                <Post
                    id={1}
                    text="Test post 1"
                    image= {preview}
                />

                <Post
                    id={2}
                    text="Second post without image"
                />

                <Post
                    id={3}
                    text="Test post 3"
                    image= {preview}
                />
            </div>
            
        </div>
    </>
}