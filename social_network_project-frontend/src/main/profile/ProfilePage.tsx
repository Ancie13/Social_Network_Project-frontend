import "./ProfileStyle.css";
import { Avatar, Button, Divider, Modal, Tag } from "antd";
import logo from "../../assets/logo_holder.png";
import Post from "../../Components/Post/Post";
import preview from "../../assets/Preview.webp";
import { EditOutlined, UserOutlined } from "@ant-design/icons";
import { useState } from "react";
import type { User, Race } from "../../types/Types";





// userData?: User
export default function ProfilePage()
{
    const [IsAvatarOpen, setIsAvatarOpen] = useState(false);
    // const user = userData ? userData : JSON.parse(localStorage.getItem("user"));
    const user = JSON.parse(localStorage.getItem("user")) as User;

    console.log(user);

    return <>
        <div className="profileWrapper">

            <div className="profileCard">

                <div className="profileHeader">

                    <div
                        className="avatarWrapper"
                        onClick={() => setIsAvatarOpen(true)}
                    >
                        <Avatar className="avatar" size={100} src={user.imageUrl || logo} icon={<UserOutlined />} />
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

                <Button
                    type="primary"
                    className="editProfileBtn"
                    icon={<EditOutlined className="editIcon"/>}
                    block
                >
                    Edit Profile
                </Button>

            </div>


            <div className="postsConteiner">

                <Post id={1} userId="" text="Test post 1" image={preview} description="" tags={[]} />
                <Post id={2} userId="" text="Second post without image" description="" tags={[]} />
                <Post id={3} userId="" text="Test post 3" image={preview} description="" tags={[]} />

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

