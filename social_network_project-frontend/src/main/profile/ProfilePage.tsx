import "./ProfileStyle.css";
import { Avatar, Button, Divider, Modal } from "antd";
import logo from "../../assets/logo_holder.webp";
import Post from "../../Components/Post";
import preview from "../../assets/Preview.webp";
import { EditOutlined, UserOutlined } from "@ant-design/icons";
import { useState } from "react";


export default function ProfilePage()
{
    const [IsAvatarOpen, setIsAvatarOpen] = useState(false);

    const user =
    {
        nickname: "User Name",
        login: "@login",
        bio: "Bio about user Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis, voluptates.",
        posts: 12,
        followers: 340,
        following: 128,
        race: "elf"
    };

    return <>
        <div className="profileWrapper">

            <div className="profileCard">

                <div className="profileHeader">

                    <div
                        className="avatarWrapper"
                        onClick={() => setIsAvatarOpen(true)}
                    >
                        <Avatar className="avatar" size={100} src={logo} icon={<UserOutlined />} />
                    </div>

                    <div className="profileNames">
                        <div className="nickname">{user.nickname}</div>
                        <div className="login">{user.login}</div>
                        <div className="race">{user.race}</div>
                    </div>

                </div>

                <Divider className="divider" />


                <div className="profileBio">
                    {user.bio}
                </div>

                <Divider className="divider" />

                <div className="profileStats">
                    <div><b>{user.posts}</b> Posts</div>
                    <div><b>{user.followers}</b> Followers</div>
                    <div><b>{user.following}</b> Following</div>
                </div>

                <Divider className="divider" />

                <Button
                    type="primary"
                    icon={<EditOutlined />}
                    block
                >
                    Edit Profile
                </Button>

            </div>


            <div className="postsConteiner">

                <Post id={1} text="Test post 1" image={preview} />
                <Post id={2} text="Second post without image" />
                <Post id={3} text="Test post 3" image={preview} />

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
                <img src={logo} className="avatarPreview" />
            </div>
        </Modal>
    </>
}

