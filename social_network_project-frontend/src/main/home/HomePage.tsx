import { useEffect, useState } from "react";
import "./HomeStyle.css";
import { Button } from "antd";
import { GetPostsHome, GetPostsRace } from "../../api/postsApi";
import PostModal from "../../Components/Post/PostModal";
import Loader from "../../Components/loader/Loader";
import type { PostProps, User } from "../../types/Types";
import Post from "../../Components/Post/Post";
import { GetMe, GetUserProfile } from "../../api/userApi";


export default function HomeContent() 
{
    const [active, setActive] = useState<"first" | "second">("first");
    const [posts, setPosts] = useState<any[]>([]);
    const [postsRace, setPostsRace] = useState<any[]>([]);
    const [selectedPost, setSelectedPost] = useState<PostProps | null>(null);
    const [openModal, setOpenModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState<Record<string, User>>({});
    const [usersRace, setUsersRace] = useState<Record<string, User>>({});
    const [isRacePage, setIsRacePage] = useState(false);
    const [user, setUser] = useState<User | null>(null);


    useEffect(() => {
        const loadData = async () => {
            setLoading(true);

            try {
                const [user, posts, racePosts] = await Promise.all([
                    GetMe(),
                    GetPostsHome(),
                    GetPostsRace()
                ]);

                setUser(user);
                setPosts(posts.data);
                setPostsRace(racePosts.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

        useEffect(() =>
        {
            const LoadUsers = async () =>
            {
                const map: Record<string, User> = {};
                const map2: Record<string, User> = {};

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

                await Promise.all(
                    postsRace.map(async (post) =>
                    {
                        if (!map2[post.userId])
                        {
                            const user = await GetUserProfile(post.userId);
                            map2[post.userId] = user;
                        }
                    })
                );

                setUsers(map);
                setUsersRace(map2);
            };

            if (posts.length > 0)
            {
                LoadUsers();
            }
        }, [posts]);

    const Posts = () => {
                return (
            <>
                {!loading && user ?
                (isRacePage ? postsRace : posts).map((post) => (
                    <Post
                        key={post.id}
                        id={post.id}
                        userId={post.userId}
                        text={post.title}
                        imageUrl={post.imageUrl}
                        description={post.bio}
                        tags={post.interests}
                        comments={post.comments}
                        myId={user?.id ?? ""}
                        onClick={() =>
                        {
                                setSelectedPost({
                                id: post.id,
                                userId: post.userId,
                                text: post.title,
                                imageUrl: post.imageUrl,
                                description: post.bio,
                                tags: post.interests,
                                comments: post.comments,
                                myId: user?.id ?? ""
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
                        id={selectedPost.id.toString()}
                        text={selectedPost.text}
                        imageUrl={selectedPost.imageUrl}
                        description={selectedPost.description}
                        tags={selectedPost.tags}
                        user={active === "first" ? users[selectedPost.userId] : usersRace[selectedPost.userId]}
                        comments={selectedPost.comments}
                    />
                )}
            </>
        );
    };

    return (
        <>
            <div className="homeContainer">
                <div className="menuContainer">
                    <Button
                        className={`menuItem ${active === "first" ? "active" : ""}`}
                        onClick={() => {
                            setActive("first")
                            setIsRacePage(false)
                        }}
                    >
                        Main
                    </Button>

                    <Button
                        className={`menuItem ${active === "second" ? "active" : ""}`}
                        onClick={() => {
                            setActive("second")
                            setIsRacePage(true)

                        }}
                    >
                        Race
                    </Button>
                </div>
                <div className="postsConteiner">

                    {Posts()}
                </div>
                
            </div>
        </>
    );
}