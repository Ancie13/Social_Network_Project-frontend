import { Avatar, Button, Divider, Modal, Tag } from "antd";
import logo from "../../assets/logo_holder.png";
import { EditOutlined, UserOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import type { User } from "../../types/Types";
import { useParams } from "react-router-dom";
import Loader from "../loader/Loader";
import { GetUserFollowers, GetUserFollowing, GetUserProfileByLogin } from "../../api/userApi";

export default function Profile() {
    const [IsAvatarOpen, setIsAvatarOpen] = useState(false);
    const { login } = useParams();
    const [user, setUser] = useState<User | null>(null);
    const [isMe, setIsMe] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);
    const [IsHovered, SetHovered] = useState(false);
    const [followers, setFollowers] = useState(0);
    const [following, setFollowing] = useState(0);
    const [isLoading, setIsLoading] = useState(true);


    console.log(login);
    
    useEffect(() =>
    {
        if (login)
        {
            loadUser(login);
            if(login === JSON.parse(sessionStorage.getItem("user")).login)
            {
                setIsMe(true);
            }
        }
    }, [login]);

    useEffect(() =>  {
        const fetchFollowers = async () => {
            let res1 = null;
            let res2 = null;

            res1 = await GetUserFollowers(user.id);
            res2 = await GetUserFollowing(user.id);

            setFollowers(res1);
            setFollowing(res2);
            console.log("Res1: " + res1);
            console.log("Res2: " + res2);
            setIsLoading(false);
        };
        fetchFollowers();
    }, [user]);

    const loadUser = async (login: string) =>
    {   
        let res = null;

        if(login) {
            res = await GetUserProfileByLogin(login);
        }
        
        
        setUser(res);
        console.log(res);
    };

    const toggleFollow = () =>
    {
        setIsFollowing(prev => !prev);
    };

    console.log(user);

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
                                src={user.imageUrl || logo} 
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
                    <div><b>{user.followers}</b> Followers</div>
                    <div><b>{user.following}</b> Following</div>
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

                {/* <Post id={1} userId="" text="Test post 1" image={preview} description="" tags={[]} />
                <Post id={2} userId="" text="Second post without image" description="" tags={[]} />
                <Post id={3} userId="" text="Test post 3" image={preview} description="" tags={[]} /> */}

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
                <img src={user.imageUrl || logo} className="avatarPreview" />
            </div>
        </Modal>
    </>
}