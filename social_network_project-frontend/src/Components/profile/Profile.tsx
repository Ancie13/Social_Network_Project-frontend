import { Avatar, Button, Divider, Modal, Tag } from "antd";
import avatarHolder from "../../assets/avatar_holder.jpg";
import { EditOutlined, UserOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import type { interes, PostProps, User } from "../../types/Types";
import { useParams } from "react-router-dom";
import Loader from "../loader/Loader";
import { FollowUser, GetAdditionalInfo, GetMe, GetUserFollowers, GetUserFollowing, GetUserProfile, GetUserProfileByLogin } from "../../api/userApi";
import FollowersModal from "../Followers/FollowersModal";
import { useAuth } from "../../api/AuthContext";
import { GetUserPosts } from "../../api/postsApi";
import Post from "../Post/Post";
import PostModal from "../Post/PostModal";
import EditProfileModal from "../EditProfile/EditProfileModal";

export default function Profile() {
    const [posts, setPosts] = useState<any[]>([]);
    const [selectedPost, setSelectedPost] = useState<PostProps | null>(null);
    const [openModal, setOpenModal] = useState(false);
    const [users, setUsers] = useState<Record<string, User>>({});
    const [IsAvatarOpen, setIsAvatarOpen] = useState(false);
    const { login } = useParams();
    const [user, setUser] = useState<User | null>(null);
    const [isMe, setIsMe] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);
    const [IsHovered, SetHovered] = useState(false);
    const [followers, setFollowers] = useState<Array<User>>([]);
    const [following, setFollowing] = useState<Array<User>>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isOpenFollowers, setIsOpenFollowers] = useState(false);
    const [isOpenFollowing, setIsOpenFollowing] = useState(false);
    const { me, loading } = useAuth();
    const [editProfileOpen, setEditProfileOpen] = useState(false);
    const [interests, setInterests] = useState<Array<interes>>([]);
    


   useEffect(() => {
        const fetchAdditionalInfo = async () => {
            try {
                setIsLoading(true);
    
                const info = await GetAdditionalInfo();
    
                setInterests(info.data.interests);
            }
            finally {
                setIsLoading(false);
            }
        };
          fetchAdditionalInfo();
      }, []);

    useEffect(() =>
    {
        if (login)
        {
            const loadUserAndCheck = async () => {
                await loadUser(login);
                const currentUser = await GetMe();
                if(currentUser && login === currentUser.login)
                {
                    setIsMe(true);
                }
            }; 
            loadUserAndCheck();
        }
    }, [login]);

    const toggleFollow = async () => {
        if(user) {
            await FollowUser(user.id);
            setIsFollowing(!isFollowing);
            await fetchFollowers();
            if (login) {
                await loadUser(login);
            }
        }
    };


    const fetchFollowers = async () => {
        if (!user) return;

        let res1 = null;
        let res2 = null;

        res1 = await GetUserFollowers(user.id);
        res2 = await GetUserFollowing(user.id);

        setFollowers(res1);
        setFollowing(res2);
        setIsLoading(false);
    };

    useEffect(()  =>  { 
        if (user) {
            // console.log("User loaded, isFollowing:", user.isFollowing);
            setIsFollowing(user.isFollowing);
            fetchFollowers();
        }
    }, [user]);

    const loadUser = async (login: string) =>
    {   
        let res = null;

        res = await GetUserProfileByLogin(login);
        
        setUser(res);
    };

    useEffect(() => {
        if (loading || !me || !user)
        {
            return;
        }

        const loadData = async () => {
            setIsLoading(true);

            try {
                const [postsResponse] = await Promise.all([
                    GetUserPosts(user.id),
                ]);

                setPosts(postsResponse.data);

                await LoadUsers(postsResponse.data);
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
    }, [loading, me, user]);
        
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
                            {!loading && me && !isLoading ?
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
                                    {isMe
                                        ? "You don't have any posts yet."
                                        : "This user doesn't have any posts yet."
                                    }
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

    if (!user || isLoading || loading)
    {
        return <Loader/>
    }
    return <>
        <div className="profileWrapper">

            <div className="profileCard">

                <div className="profileHeader">

                    <div
                        className="avatarWrapper"
                        onClick={() => setIsAvatarOpen(true)}
                    >
                        <div
                            onMouseEnter={() => SetHovered(true)}
                            onMouseLeave={() => SetHovered(false)}
                        >
                            <Avatar 
                                className="avatar" 
                                size={100} 
                                src={user.imageUrl ? `${user.imageUrl}?v=${Date.now()}` : avatarHolder}
                                icon={<UserOutlined />}
                                
                                style={{ boxShadow: IsHovered
                                        ? `0 0 0 2px ${user.race.themeColorHex}`
                                        : "none" 
                                }}
                            />
                        </div>
                    </div>

                    <div className="profileNames">
                        <div className="nickname">{user.nickname}</div>
                        <div className="login">@{user.login}</div>
                        <div className="race" style={{ color: user.race.themeColorHex }}>{user.race.name}</div>
                    </div>

                </div>

                <Divider className="divider" />


                <div className="profileBio">
                    {user.bio ? user.bio : isMe ? "Tell something about yourself..." : null}
                </div>

                {user.bio ? (
                    <Divider className="divider" />
                ) : (
                    isMe && !user.bio ? (<Divider className="divider" />) : ("")
                )
                }

                <div className="profileStats">
                    <div><b>{posts.length}</b> Posts</div>
                    <div
                        onClick={() => setIsOpenFollowers(true)}
                    >
                        <b>{followers.length}</b> Followers
                    </div>
                    <div
                        onClick={() => setIsOpenFollowing(true)}
                    >
                        <b>{following.length}</b> Following
                    </div>
                </div>

                <Divider className="divider" />
                <div className="tagsBoxProfile">
                    {user.interests.map((tag) => (
                        <Tag
                            key={tag.id}
                            className="customTagProfile"
                            style={{ "--interest-color": tag.color } as React.CSSProperties}
                        >{tag.name}</Tag>
                    ))}
                </div>
                <Divider className="divider" />

                
                <div className="editProfileBtnBox">
                {isMe && 
                    <Button
                        type="primary"
                        className="editProfileBtn"
                        icon={<EditOutlined className="editIcon"/>}
                        block
                        onClick={() => setEditProfileOpen(true)}
                    >
                        Edit Profile
                    </Button>
                }
                {!isMe &&
                    <Button
                        className={`followBtn ${isFollowing ? "following" : ""}`}
                        type={isFollowing ? "default" : "primary"}
                        onClick={toggleFollow}
                    >
                        {isFollowing ? "Following" : "Follow"}
                    </Button>
                }
                </div>
                

                

            </div>


            <div className="postsConteiner">
                {Posts()}
            </div>

        </div>

        <Modal
            open={IsAvatarOpen}
            footer={null}
            onCancel={() => setIsAvatarOpen(false)}
            centered
            width={600}
            className="avatarModal"
        >
            <div className="avatarModalContent">
                <img src={user.imageUrl ? `${user.imageUrl}?v=${Date.now()}` : avatarHolder} className="avatarPreview" />
            </div>
        </Modal>

        <FollowersModal
            open={isOpenFollowers}
            onClose={() => setIsOpenFollowers(false)}
            type="followers"
            users={followers}
        />

        <FollowersModal
            open={isOpenFollowing}
            onClose={() => setIsOpenFollowing(false)}
            type="following"
            users={following}
        />
        <EditProfileModal
            User={me}
            open={editProfileOpen}
            onClose={() => setEditProfileOpen(false)}
            interests={interests}
        />
    </>
}