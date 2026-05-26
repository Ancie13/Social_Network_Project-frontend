import "./ProfileStyle.css";
import { Avatar, Button, Divider, Modal, Tag } from "antd";
import logo from "../../assets/logo_holder.png";
import Post from "../../Components/Post/Post";
import preview from "../../assets/Preview.webp";
import { EditOutlined, UserOutlined } from "@ant-design/icons";
import { useState } from "react";


export default function ProfilePage()
{
    const [IsAvatarOpen, setIsAvatarOpen] = useState(false);
    const user = JSON.parse(localStorage.getItem("user"));

    console.log(user);

    // const user =
    // {
    //     nickname: "User Name",
    //     login: "@login",
    //     bio: "Bio about user Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis, voluptates.",
    //     posts: 12,
    //     followers: 340,
    //     following: 128,
    //     race: "elf"
    // };

    return <>
        <div className="profileWrapper">

            <div className="profileCard">

                <div className="profileHeader">

                    <div
                        className="avatarWrapper"
                        onClick={() => setIsAvatarOpen(true)}
                    >
                        <Avatar className="avatar" size={100} src={user.data.imageUrl || logo} icon={<UserOutlined />} />
                    </div>

                    <div className="profileNames">
                        <div className="nickname">{user.data.nickname}</div>
                        <div className="login">@{user.data.login}</div>
                        <div className="race" style={{ color: user.data.race.themeColorHex }}>{user.data.race.name}</div>
                    </div>

                </div>

                <Divider className="divider" />


                <div className="profileBio">
                    {user.data.bio || "Write something about you..."} 
                </div>

                <Divider className="divider" />

                <div className="profileStats">
                    <div><b>{user.posts}</b> Posts</div>
                    <div><b>{user.followers}</b> Followers</div>
                    <div><b>{user.following}</b> Following</div>
                </div>

                <Divider className="divider" />
                <div className="tagsBoxProfile">
                    {user.data.interests.map((tag) => (
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
                <img src={user.data.imageUrl || logo} className="avatarPreview" />
            </div>
        </Modal>
    </>
}

