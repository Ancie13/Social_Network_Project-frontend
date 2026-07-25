import { useEffect, useState } from "react";
import "./HomeStyle.css";
import { Button } from "antd";
import { GetPostsHome, GetPostsRace } from "../../api/postsApi";
import PostModal from "../../Components/Post/PostModal";
import Loader from "../../Components/loader/Loader";
import type { PostProps, User } from "../../types/Types";
import Post from "../../Components/Post/Post";
import { GetUserProfile } from "../../api/userApi";
import { useAuth } from "../../api/AuthContext";


export default function HomeContent() 
{
    const [active, setActive] = useState<"first" | "second">("first");
    const [posts, setPosts] = useState<any[]>([]);
    const [postsRace, setPostsRace] = useState<any[]>([]);
    const [selectedPost, setSelectedPost] = useState<PostProps | null>(null);
    const [openModal, setOpenModal] = useState(false);
    const [isloading, setIsLoading] = useState(true);
    const [users, setUsers] = useState<Record<string, User>>({});
    const [usersRace, setUsersRace] = useState<Record<string, User>>({});
    const [isRacePage, setIsRacePage] = useState(false);
    const { me, loading } = useAuth();

    useEffect(() => {
        document.title = "Home | EtherLink";
    }, []);


    useEffect(() => {

        if (loading || !me)
        {
            return;
        }

        const loadData = async () => {
            setIsLoading(true);

            try {
                const [postsResponse, racePostsResponse] = await Promise.all([
                    GetPostsHome(),
                    GetPostsRace()
                ]);

                setPosts(postsResponse.data);
                setPostsRace(racePostsResponse.data);

                await LoadUsers(
                    postsResponse.data,
                    racePostsResponse.data
                );
            }
            catch (err)
            {
                console.error(err);
            }
            finally
            {
                setIsLoading(false);
            }
        };

        loadData();
    }, [loading, me]);

    const LoadUsers = async (postsList: any[], postsRaceList: any[]) => {
        const map: Record<string, User> = {};
        const map2: Record<string, User> = {};

        await Promise.all(
            postsList.map(async (post) => {
                if (!map[post.userId]) {
                    const user = await GetUserProfile(post.userId);
                    map[post.userId] = user;
                }
            })
        );

        await Promise.all(
            postsRaceList.map(async (post) => {
                if (!map2[post.userId]) {
                    const user = await GetUserProfile(post.userId);
                    map2[post.userId] = user;
                }
            })
        );

        setUsers(map);
        setUsersRace(map2);
    };

    const selectedPostUser = selectedPost
        ? active === "first"
            ? users[selectedPost.userId]
            : usersRace[selectedPost.userId]
        : undefined;

    const Posts = () => {
                return (
            <>
                {!loading && me && !isloading ?
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
                        myId={me?.id ?? ""}
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
                                myId: me?.id ?? ""
                            });

                            setOpenModal(true);
                        }}
                    />
                )) : <Loader></Loader>}
                {selectedPost && selectedPostUser && (
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
                        user={selectedPostUser}
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