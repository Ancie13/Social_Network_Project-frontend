import { useEffect, useRef, useState } from "react";
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
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [users, setUsers] = useState<Record<string, User>>({});
    const [usersRace, setUsersRace] = useState<Record<string, User>>({});
    const [isRacePage, setIsRacePage] = useState(false);
    const { me, loading } = useAuth();


    const loadingMoreRef = useRef(false);
    const loadingMoreRaceRef = useRef(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [racePage, setRacePage] = useState(1);
    const [hasMoreRace, setHasMoreRace] = useState(true);
    const [isLoadingMoreRace, setIsLoadingMoreRace] = useState(false);

    useEffect(() => {
        document.title = "Home | EtherLink";
    }, []);


    useEffect(() => {

        if (loading || !me)
        {
            return;
        }

        const loadData = async () => {
            setIsInitialLoading(true);

            try {
                const [postsResponse, racePostsResponse] = await Promise.all([
                    GetPostsHome(1, 5),
                    GetPostsRace(1, 5)
                ]);

                setPosts(postsResponse.data);
                setPostsRace(racePostsResponse.data);

                setPage(1);
                setRacePage(1);

                setHasMore(postsResponse.data.length === 5);
                setHasMoreRace(racePostsResponse.data.length === 5);

                await LoadUsers(
                    postsResponse.data,
                    racePostsResponse.data
                );
            }
            catch (err) {
                console.error(err);
            }
            finally {
                setIsInitialLoading(false);
            }
        };

        loadData();
    }, [loading, me]);


    const loadMorePosts = async () => {
        if (
            loadingMoreRef.current ||
            isInitialLoading ||
            loading ||
            !me ||
            !hasMore
        ) {
            return;
        }

        loadingMoreRef.current = true;
        setIsLoadingMore(true);

        try {
            const nextPage = page + 1;

            const response = await GetPostsHome(nextPage, 5);

            const newPosts = response.data;

            if (newPosts.length === 0) {
                setHasMore(false);
                return;
            }

            setPosts(prev => [...prev, ...newPosts]);

            setPage(nextPage);

            if (newPosts.length < 5) {
                setHasMore(false);
            }

            await LoadUsers(newPosts, []);
        }
        catch (err) {
            console.error(err);
        }
        finally {
            loadingMoreRef.current = false;
            setIsLoadingMore(false);
        }
    };

    const loadMoreRacePosts = async () => {
        if (
            loadingMoreRaceRef.current ||
            isInitialLoading ||
            loading ||
            !me ||
            !hasMoreRace
        ) {
            return;
        }

        loadingMoreRaceRef.current = true;
        setIsLoadingMoreRace(true);

        try {

            const nextPage = racePage + 1;

            console.log("RACE → Loading page:", nextPage);

            const response = await GetPostsRace(nextPage, 5);

            const newPosts = response.data;

            if (newPosts.length === 0) {
                setHasMoreRace(false);
                return;
            }

            setPostsRace(prev => [...prev, ...newPosts]);

            setRacePage(nextPage);

            if (newPosts.length < 5) {
                setHasMoreRace(false);
            }

            await LoadUsers([], newPosts);

        }
        catch (err) {
            console.error("Failed to load more race posts:", err);
        }
        finally {
            loadingMoreRaceRef.current = false;
            setIsLoadingMoreRace(false);
        }
    };

    const LoadUsers = async (
        postsList: any[],
        postsRaceList: any[]
    ) => {

        const map: Record<string, User> = {
            ...users
        };

        const map2: Record<string, User> = {
            ...usersRace
        };

        await Promise.all(
            postsList.map(async (post) => {

                if (!map[post.userId])
                {
                    const user = await GetUserProfile(post.userId);
                    map[post.userId] = user;
                }

            })
        );

        await Promise.all(
            postsRaceList.map(async (post) => {

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


    useEffect(() => {
        const handleScroll = () => {

            if (isInitialLoading || loading || !me) {
                return;
            }

            const scrollPosition =
                window.innerHeight + window.scrollY;

            const pageHeight =
                document.documentElement.scrollHeight;

            if (scrollPosition < pageHeight - 300) {
                return;
            }

            if (isRacePage) {
                loadMoreRacePosts();
            }
            else {
                loadMorePosts();
            }
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };

    }, [
        page,
        racePage,
        hasMore,
        hasMoreRace,
        isInitialLoading,
        loading,
        me,
        isRacePage
    ]);

    const selectedPostUser = selectedPost
        ? active === "first"
            ? users[selectedPost.userId]
            : usersRace[selectedPost.userId]
        : undefined;

    const Posts = () => {

        const currentPosts = isRacePage
            ? postsRace
            : posts;

        if (loading || !me) {
            return <Loader />;
        }

        return (
            <>
                {currentPosts.map((post) => (
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
                        onClick={() => {
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
                ))}

                {selectedPost && selectedPostUser && (
                    <PostModal
                        open={openModal}
                        onClose={() => {
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

                    {(isRacePage ? isLoadingMoreRace : isLoadingMore) && (
                        <div className="loadMoreLoader">
                            <div className="loadMoreSpinner"></div>
                            <span>Loading more posts...</span>
                        </div>
                    )}

                    {!isRacePage && !hasMore && posts.length > 0 && (
                        <div className="noMorePosts">
                            No more posts
                        </div>
                    )}

                    {isRacePage && !hasMoreRace && postsRace.length > 0 && (
                        <div className="noMorePosts">
                            No more posts
                        </div>
                    )}

                </div>
                
            </div>
        </>
    );
}