import "./PostModalStyle.css";
import { Modal, Tag, Input, Button, Avatar } from "antd";
import {
    SendOutlined,
    CloseOutlined,
    SmileOutlined
} from "@ant-design/icons";

import { useEffect, useState } from "react";
import EmojiPicker from "emoji-picker-react";
import "./PostModalStyle.css";
import avatarHolder from "../../assets/avatar_holder.jpg";
import type { PostPropsModal, User } from "../../types/Types";
import { useNavigate } from "react-router-dom";
import { GetUserProfile } from "../../api/userApi";
import Loader from "../loader/Loader";
import formatDate from "../../shared/Date/FormatDate";


export default function PostModal({
    open,
    onClose,
    text,
    imageUrl,
    description,
    tags,
    user,
    comments
}: PostPropsModal)
{
    const [commentText, setCommentText] = useState("");
    const [isPickerOpen, setIsPickerOpen] = useState(false);
    const [commentators, setCommentators] = useState<Record<string, User>>({});
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const LoadCommentators = async () =>
    {
        const map: Record<string, User> = {};

        await Promise.all(
            comments.map(async (comment) =>
            {
                    if (!map[comment.userId])
                    {
                        const user = await GetUserProfile(comment.userId);
                        map[comment.userId] = user;
                    }
            })
        );

        setCommentators(map);
        setLoading(false);
    };

    useEffect(() => {
        if(comments.length > 0)
        {
            setLoading(true);
            LoadCommentators();
        }
        setLoading(false);
    }, [comments]);

    const sendComment = () =>
    {
        if(!commentText.trim())
            return;
        // const currentComment = null: Comment;
        // comments.push()
        // setComments(prev => [
        //     ...prev,
        //     {
        //         id: Date.now(),
        //         text: commentText
        //     }
        // ]);
        // export type Comment = {
        //     id: string;
        //     userId: string;
        //     postId: string;
        //     likesQnt: number;
        //     isLiked: boolean;
        //     createdAt: string;
        //     bio: string;
        // };

        setCommentText("");
    };


    if(loading) {
        return <Loader/>
    }
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

                    {imageUrl && (
                        <img
                            src={imageUrl}
                            className="modalImage"
                        />
                    )}

                </div>

                <div className="rightSide">

                    <div className="userHeader">

                        <Avatar
                            size={50}
                            className="userAvatar"
                            src={user.imageUrl || avatarHolder}
                            onClick={() => {
                                navigate(`/profile/${user.login}`);
                            }}
                        />

                        <div className="userInfo">

                            <div 
                                className="nickname"
                                onClick={() => {
                                    navigate(`/profile/${user.login}`);
                                }}
                            >
                                {user.nickname}
                            </div>

                            <div 
                                className="username"
                                onClick={() => {
                                    navigate(`/profile/${user.login}`);
                                }}
                            >
                                @{user.login}
                            </div>

                        </div>

                    </div>

                    <div className="descriptionBox">
                        {description}
                    </div>

                    <div className="commentsSection">
                        {comments.length === 0 && (
                            <div className="commentsPlaceHolder">Enjoy this post?<br/>Be the first to comment.</div>
                        )
                        
                        }
                        {comments.map(comment => (

                            <div
                                key={comment.id}
                                className="modalComment"
                            >
                                    <Avatar 
                                    size={32}
                                    className="userAvatar"
                                    src={commentators[comment.userId]?.imageUrl || avatarHolder}
                                    onClick={() => {
                                        const c = commentators[comment.userId];
                                        if (c) navigate(`/profile/${c.login}`);
                                    }}
                                />

                                <div className="commentContent">

                                    <span 
                                        className="commentUser"
                                        onClick={() => {
                                            const c = commentators[comment.userId];
                                            if (c) navigate(`/profile/${c.login}`);
                                        }}
                                    >
                                        {commentators[comment.userId]?.nickname}
                                    </span>

                                    <span className="commentText">
                                        {comment.bio}
                                    </span>

                                    <span className="commentDate">
                                        {formatDate(comment.createdAt)}
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