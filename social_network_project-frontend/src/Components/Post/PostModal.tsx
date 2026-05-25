import "./PostModalStyle.css";
import type { Comment, TagType } from "./Post";
import { Modal, Tag, Input, Button, Avatar } from "antd";
import {
    SendOutlined,
    CloseOutlined,
    SmileOutlined
} from "@ant-design/icons";

import { useState } from "react";
import EmojiPicker from "emoji-picker-react";
import "./PostModalStyle.css";

type PostProps = {
    open: boolean;
    onClose: () => void;
    text: string;
    image?: string | null;
    description?: string;
    tags: TagType[];
};

export default function PostModal({
    open,
    onClose,
    text,
    image,
    description,
    tags
}: PostProps)
{
    const [commentText, setCommentText] = useState("");
    const [isPickerOpen, setIsPickerOpen] = useState(false);

    const [comments, setComments] = useState<Comment[]>([
        { id: 1, text: "Nice 🔥" },
        { id: 2, text: "Looks good!" },
        { id: 3, text: "Amazing" }
    ]);

    const sendComment = () =>
    {
        if(!commentText.trim())
            return;

        setComments(prev => [
            ...prev,
            {
                id: Date.now(),
                text: commentText
            }
        ]);

        setCommentText("");
    };

    return (
        <Modal
            open={open}
            footer={null}
            onCancel={onClose}
            width={1200}
            className="postModal"
        >
            <div className="modalContent">

                <div className="leftSide">

                    <h2 className="postTitle">
                        {text}
                    </h2>

                    <div className="modalTags">

                        {tags.map(tag => (
                            <Tag
                                key={tag.id}
                                className="modalTag"
                                style={{
                                    "--interest-color": tag.color
                                } as React.CSSProperties}
                            >
                                {tag.name}
                            </Tag>
                        ))}

                    </div>

                    {image && (
                        <img
                            src={image}
                            className="modalImage"
                        />
                    )}

                </div>

                <div className="rightSide">

                    <div className="userHeader">

                        <Avatar
                            size={50}
                            className="userAvatar"
                        >
                            U
                        </Avatar>

                        <div className="userInfo">

                            <div className="nickname">
                                User Nickname
                            </div>

                            <div className="username">
                                @username
                            </div>

                        </div>

                    </div>

                    <div className="descriptionBox">
                        {description}
                    </div>

                    <div className="commentsSection">

                        {comments.map(comment => (

                            <div
                                key={comment.id}
                                className="modalComment"
                            >
                                <Avatar size={32} className="userAvatar">
                                    U
                                </Avatar>

                                <div className="commentContent">

                                    <span className="commentUser">
                                        User
                                    </span>

                                    <span className="commentText">
                                        {comment.text}
                                    </span>

                                </div>

                            </div>

                        ))}

                    </div>

                    <div className="commentBottom">

                        <Input
                            value={commentText}
                            className="commentField"
                            placeholder="Write comment..."
                            onChange={(e)=>
                                setCommentText(
                                    e.target.value
                                )
                            }
                        />

                        <Button
                            type="text"
                            icon={
                                isPickerOpen
                                ? <CloseOutlined/>
                                : <SmileOutlined/>
                            }
                            onClick={() =>
                                setIsPickerOpen(
                                    prev => !prev
                                )
                            }
                        />

                        <Button
                            type="text"
                            icon={<SendOutlined />}
                            onClick={sendComment}
                        />

                    </div>

                    {isPickerOpen &&
                    <div className="pickerBox">

                        <EmojiPicker
                            onEmojiClick={(emoji)=>
                            {
                                setCommentText(
                                    prev =>
                                    prev + emoji.emoji
                                );
                            }}
                        />

                    </div>
                    }

                </div>

            </div>
        </Modal>
    );
}