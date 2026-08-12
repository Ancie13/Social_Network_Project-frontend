import { useEffect, useRef, useState } from "react";
import { GetLikedPosts } from "../../api/postsApi";
import type { PostProps, User } from "../../types/Types";
import { useAuth } from "../../api/AuthContext";
import { GetUserProfile } from "../../api/userApi";
import Post from "../../Components/Post/Post";
import Loader from "../../Components/loader/Loader";
import PostModal from "../../Components/Post/PostModal";
import "../home/HomeStyle.css";
import "./LikesStyle.css";

export default function LikesPage()
{
    const [posts, setPosts] = useState<any[]>([]);
    const [selectedPost, setSelectedPost] = useState<PostProps | null>(null);
    const [openModal, setOpenModal] = useState(false);

    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    const [users, setUsers] = useState<Record<string, User>>({});

    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const loadingMoreRef = useRef(false);

    const { me, loading } = useAuth();


    useEffect(() => {
        document.title = "Likes | EtherLink";
    }, []);


    useEffect(() => {

        if (loading || !me)
        {
            return;
        }

        const loadData = async () => {

            setIsInitialLoading(true);

            try
            {
                const response = await GetLikedPosts(1, 5);

                const newPosts = response.data;

                setPosts(newPosts);
                setPage(1);

                setHasMore(newPosts.length === 5);

                await LoadUsers(newPosts);
            }
            catch (err)
            {
                console.error(err);
            }
            finally
            {
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
            isLoadingMore ||
            !hasMore
        )
        {
            return;
        }

        loadingMoreRef.current = true;
        setIsLoadingMore(true);

        try
        {
            const nextPage = page + 1;

            console.log("Loading liked posts page:", nextPage);

            const response = await GetLikedPosts(nextPage, 5);

            const newPosts = response.data;

            if (newPosts.length === 0)
            {
                setHasMore(false);
                return;
            }

            setPosts(prev => [
                ...prev,
                ...newPosts
            ]);

            setPage(nextPage);

            if (newPosts.length < 5)
            {
                setHasMore(false);
            }

            await LoadUsers(newPosts);
        }
        catch (err)
        {
            console.error("Failed to load more liked posts:", err);
        }
        finally
        {
            loadingMoreRef.current = false;
            setIsLoadingMore(false);
        }
    };

    useEffect(() => {

        const handleScroll = () => {

            if (
                loading ||
                !me ||
                isInitialLoading
            )
            {
                return;
            }

            const scrollPosition =
                window.innerHeight + window.scrollY;

            const pageHeight =
                document.documentElement.scrollHeight;

            if (scrollPosition >= pageHeight - 300)
            {
                loadMorePosts();
            }
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };

    }, [
        page,
        hasMore,
        isInitialLoading,
        isLoadingMore,
        loading,
        me
    ]);


    const LoadUsers = async (postsList: any[]) => {

        const map: Record<string, User> = {
            ...users
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

        setUsers(map);
    };


    const selectedPostUser = selectedPost
        ? users[selectedPost.userId]
        : undefined;


    const Posts = () => {

        if (loading || !me || isInitialLoading)
        {
            return <Loader />;
        }

        if (posts.length === 0)
        {
            return (
                <div className="likedPostsPlaceHolder">
                    Your liked posts will be saved here
                </div>
            );
        }

        return (
            <>
                {posts.map((post) => (

                    <Post
                        key={post.id}
                        id={post.id}
                        userId={post.userId}
                        text={post.title}
                        imageUrl={post.imageUrl}
                        description={post.bio}
                        tags={post.interests}
                        comments={post.comments}
                        myId={me.id}

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
                                myId: me.id
                            });

                            setOpenModal(true);
                        }}
                    />

                ))}

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
        <div className="homeContainer">

            <div className="postsConteiner">

                {Posts()}

                {isLoadingMore && (
                    <div className="loadMoreLoader">
                        <div className="loadMoreSpinner"></div>

                        <span>
                            Loading more posts...
                        </span>
                    </div>
                )}

                {!hasMore && posts.length > 0 && (
                    <div className="noMorePosts">
                        No more liked posts
                    </div>
                )}

            </div>

        </div>
    );
}