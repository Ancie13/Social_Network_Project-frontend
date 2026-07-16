import { useEffect, useState } from "react";
import { GetLikedPosts } from "../../api/postsApi"
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
    const [isloading, setIsLoading] = useState(true);
    const [users, setUsers] = useState<Record<string, User>>({});
    const { me, loading } = useAuth();


    useEffect(() => {
    
        if (loading || !me)
        {
            return;
        }
    
        const loadData = async () => {
            setIsLoading(true);
    
            try {
                const [postsResponse] = await Promise.all([
                    GetLikedPosts(),
                ]);
    
                setPosts(postsResponse.data);
    
                await LoadUsers(
                    postsResponse.data
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
    
        const LoadUsers = async (postsList: any[]) => {
            const map: Record<string, User> = {};
    
            await Promise.all(
                postsList.map(async (post) => {
                    if (!map[post.userId]) {
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
                        return (
                    <>
                        {!loading && me && !isloading ?
                        posts.map((post) => (
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
                        {posts.length > 0 ?
                            <></> :
                            <div className="likedPostsPlaceHolder">
                            Your liked posts will be saved here
                            </div>
                        }
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
                <div className="postsConteiner">

                    {Posts()}
                </div>
                
            </div>
        </>
    );
}