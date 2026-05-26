import { useEffect, useState } from "react";
import "./HomeStyle.css";
import { Button } from "antd";
import Post, { type PostProps } from "../../Components/Post/Post";
import { GetOwn, GetPostsHome } from "../../api/postsApi";
import PostModal from "../../Components/Post/PostModal";
import Loader from "../../Components/loader/Loader";


export default function HomeContent() 
{
    const [active, setActive] = useState<"first" | "second">("first");
    const [posts, setPosts] = useState<any[]>([]);
    const [selectedPost, setSelectedPost] = useState<PostProps | null>(null);
    const [openModal, setOpenModal] = useState(false);
    const [loading, setLoading] = useState(true);


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

        useEffect(() => {
            if(posts){
                setLoading(false);
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
                posts.map((post, index) => (
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
                                tags: post.interests
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