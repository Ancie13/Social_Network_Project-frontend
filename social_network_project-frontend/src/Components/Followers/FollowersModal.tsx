import { Avatar, Modal } from "antd";
import "./FollowersModalStyle.css";
import type { User } from "../../types/Types";
import { useNavigate } from "react-router-dom";
import avatarHolder from "../../assets/avatar_holder.jpg";

interface FollowersModalProps {
    open: boolean;
    onClose: () => void;
    type: "followers" | "following";
    users: User[];
}

export default function FollowersModal({
    open,
    onClose,
    type,
    users
}: FollowersModalProps) {

    const navigate = useNavigate();

    return <>
        <Modal
            open={open}
            onCancel={onClose}
            footer={null}
            centered
            width={400}
            className="followersModal"
        >
            <div className="followersContainer">

                <div className="title">
                    {type === "followers" ? "Followers" : "Following"}
                </div>

                <div className="usersList">

                    {users.length === 0 ? (
                        <div className="emptyState">
                            No {type} yet
                        </div>
                    ) : (
                        users.map(user => (
                            <div
                                key={user.id}
                                className="userRowFollowers"
                                onClick={() =>
                                {
                                    navigate(`/profile/${user.login}`);
                                    onClose();
                                }}
                            >
                                <Avatar
                                    size={40}
                                    src={user.imageUrl ? `${user.imageUrl}?v=${Date.now()}` : avatarHolder}
                                />

                                <div className="userInfo">
                                    <div className="nickname">
                                        {user.nickname}
                                    </div>

                                    <div className="login">
                                        @{user.login}
                                    </div>
                                </div>

                            </div>
                        ))
                    )}

                </div>

            </div>
        </Modal>
    </>
}