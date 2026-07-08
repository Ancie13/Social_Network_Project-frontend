import { Avatar, Button, Divider, Modal, Tag } from "antd";
import avatarHolder from "../../assets/avatar_holder.jpg";
import { EditOutlined, UserOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import type { User } from "../../types/Types";
import { useParams } from "react-router-dom";
import Loader from "../loader/Loader";
import { FollowUser, GetMe, GetUserFollowers, GetUserFollowing, GetUserProfileByLogin } from "../../api/userApi";
import FollowersModal from "../Followers/FollowersModal";

export default function Profile() {
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
            console.log("User loaded, isFollowing:", user.isFollowing);
            setIsFollowing(user.isFollowing);
            fetchFollowers();
        }
    }, [user]);

    const loadUser = async (login: string) =>
    {   
        let res = null;

        res = await GetUserProfileByLogin(login);
        
        setUser(res);
        console.log(res);
    };

    if (!user || isLoading)
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
                                src={user.imageUrl || avatarHolder}
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
                    {user.bio || "Write something about you..."} 
                </div>

                <Divider className="divider" />

                <div className="profileStats">
                    <div><b>{user.posts}</b> Posts</div>
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
                <img src={user.imageUrl || avatarHolder} className="avatarPreview" />
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
    </>
}