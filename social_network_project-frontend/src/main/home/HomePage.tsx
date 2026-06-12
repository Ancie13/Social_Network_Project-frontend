import { useEffect, useState } from "react";
import "./HomeStyle.css";
import { Button } from "antd";
import { GetPostsHome, GetPostsRace } from "../../api/postsApi";
import PostModal from "../../Components/Post/PostModal";
import Loader from "../../Components/loader/Loader";
import type { PostProps, User } from "../../types/Types";
import Post from "../../Components/Post/Post";
import { GetUserProfile } from "../../api/userApi";


export default function HomeContent() 
{
    const [active, setActive] = useState<"first" | "second">("first");
    const [posts, setPosts] = useState<any[]>([]);
    const [postsRace, setPostsRace] = useState<any[]>([]);
    const [selectedPost, setSelectedPost] = useState<PostProps | null>(null);
    const [openModal, setOpenModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState<Record<number, User>>({});
    const [isRacePage, setIsRacePage] = useState(false);

    const Posts = () => {
        
        useEffect(() =>
        {
            const loadPosts = async () =>
            {
                const res = await GetPostsHome();
                // const resRace = await GetPostsRace();

                setPosts(res.data);
                // setPostsRace(resRace.data);
            };

            loadPosts();
        }, []);

        useEffect(() =>
        {
            if (posts.length > 0)
            {
                setLoading(false);
            }
        }, [posts]);

        useEffect(() =>
        {
            const LoadUsers = async () =>
            {
                const map: Record<number, User> = {};

                await Promise.all(
                    posts.map(async (post) =>
                    {
                        if (!map[post.userId])
                        {
                            const user = await GetUserProfile(post.userId);
                            map[post.userId] = user;
                        }
                    })
                );

                setUsers(map);
            };

            if (posts.length > 0)
            {
                LoadUsers();
            }
        }, [posts]);

        // const loadOwn = async (userId:string) =>
        // {
        //     const res = await GetOwn(userId);

        //     console.log(res.stringify);
        // };


        // if(loading) {
        //     return <Loader></Loader>;
        // }
        return (
            <>
                {!loading ?
                (isRacePage ? postsRace : posts).map((post) => (
                    <Post
                        key={post.id}
                        id={post.id}
                        userId={post.userId}
                        text={post.title}
                        image={post.imageUrl}
                        description={post.bio}
                        tags={post.interests}
                        onClick={() =>
                        {
                            setSelectedPost({
                                id: post.id,
                                userId: post.userId,
                                text: post.title,
                                image: post.imageUrl,
                                description: post.bio,
                                tags: post.interests,
                            });

                            setOpenModal(true);
                        }}
                    />
                )) : <Loader></Loader>}
                {selectedPost && (
                    <PostModal
                        open={openModal}
                        onClose={() =>
                        {
                            setOpenModal(false);
                            setSelectedPost(null);
                        }}
                        text={selectedPost.text}
                        image={selectedPost.image}
                        description={selectedPost.description}
                        tags={selectedPost.tags}
                    />
                )}
            </>
        );
    };

    return <>
        <div className="homeContainer">
            <div className="menuContainer">
                <Button
                    className={`menuItem ${active === "first" ? "active" : ""}`}
                    onClick={() => {
                        setActive("first")
                        setIsRacePage(false)
                    }}
                >
                    Option 1
                </Button>

                <Button
                    className={`menuItem ${active === "second" ? "active" : ""}`}
                    onClick={() => {
                        setActive("second")
                        setIsRacePage(true)

                    }}
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