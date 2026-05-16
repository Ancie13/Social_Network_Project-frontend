import { useEffect, useState } from "react";
import "./HomeStyle.css";
import { Button } from "antd";
import Post from "../../Components/Post";
import { GetPostsHome } from "../../api/userApi";


export default function HomeContent() 
{
    const [active, setActive] = useState<"first" | "second">("first");
    const [posts, setPosts] = useState<any[]>([]);

    const Posts = () => {
        
        useEffect(() =>
        {
            

            const loadPosts = async () =>
            {
                const res = await GetPostsHome();

                // console.log(JSON.stringify(res, null, 2));s

                setPosts(res.data);
            };
            
            loadPosts();
        }, []);

        return (
            <>
                {posts.map((post, index) => (
                    <Post
                        id={post.id}
                        text={post.title}
                        image={post.imageUrl}
                        description={post.bio}
                        tags={post.interests}
                    />
                ))}
            </>
        );
    };

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

                {Posts()}
            </div>
            
        </div>
    </>
}