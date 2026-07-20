import "./PostModalStyle.css";
import { Modal, Tag, Input, Button, Avatar } from "antd";
import {
    SendOutlined,
    CloseOutlined,
    SmileOutlined,
    LikeFilled,
    LikeOutlined,
    StarOutlined,
    StarFilled
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
import { AddComment, GetPostLikes, GetPostSaves, LikePost, SavePost } from "../../api/postsApi";
import { useAuth } from "../../api/AuthContext";


export default function PostModal({
    id,
    open,
    onClose,
    text,
    imageUrl,
    description,
    tags,
    user,
    comments,
}: PostPropsModal)
{
    const [liked, setLiked] = useState(false);
    const [likes, setLikes] = useState<User[]>([]);
    const [saves, setSaves] = useState<User[]>([]);
    const [saved, setSaved] = useState(false);
    const [commentText, setCommentText] = useState("");
    const [isPickerOpen, setIsPickerOpen] = useState(false);
    const [commentators, setCommentators] = useState<Record<string, User>>({});
    const [isloading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const { me, loading } = useAuth();
    // const [newComments, setNewComments] = useState<Array<Comment>>([]);

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

        loadPostLikes(id.toString());
        loadPostSaves(id.toString());
        setCommentators(map);
    };

useEffect(() => {
    async function load()
    {
        setIsLoading(true);
        try
        {
            await LoadCommentators();
        }
        finally
        {
            setIsLoading(false);
        }
    }
    load();
}, [comments]);

    const sendComment = async () =>
    {
        // setIsLoading(true);
        if(!commentText.trim())
            return;

        await AddComment(id, commentText);

        setCommentText("");
    };
    
    const toggleLike = async () => {
        if(likes) {
            await LikePost(id);
            setLiked(!liked);
            await loadPostLikes(id.toString());
        }
    };

    const toggleSave = async () => {
        if(saves) {
            await SavePost(id);
            setSaved(!saved);
            await loadPostSaves(id.toString());
        }
    };

    const loadPostLikes = async (postId: string) =>
    {
        const res = await GetPostLikes(postId);
        setLikes(res);
    };

    const loadPostSaves = async (postId: string) =>
    {
        const res = await GetPostSaves(postId);
        setSaves(res);
    };

    useEffect(()  =>  { 
        if (me && me.id && likes) {
            if(likes.find(user => user.id === me.id))
            {
                setLiked(true);
            }
        }
    }, [me, likes]);

    useEffect(()  =>  { 
        if (me && me.id && saves) {
            if(saves.find(user => user.id === me.id))
            {
                setSaved(true);
            }
        }
    }, [me, saves]);
    


    if(isloading && loading) {
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

                    {user && (
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
                    )}

                    <div className="buttonsBox">
                        <div className="likesBox">
                            <Button
                                type="text"
                                icon={liked ? <LikeFilled /> : <LikeOutlined />}
                                onClick={(e) => {
                                    toggleLike();
                                    e.stopPropagation();
                                }}
                            />
                            <div className="likesCount">{likes.length}</div>
                        </div>
                        <Button
                            type="text"
                            icon={saved ? <StarFilled/> : <StarOutlined/>}
                            onClick={(e) => {
                                toggleSave();
                                e.stopPropagation();
                            }}
                        />
                    </div>

                    <div className="descriptionBox">
                        {description}
                    </div>

                    <div className="commentsSection">
                        {comments.length === 0 && (
                            <div className="commentsPlaceHolder">Enjoy this post?<br/>Be the first to comment.</div>
                        )
                        
                        }
                        {/* {(newComments ? newComments : comments)*/ comments.map(comment => ( 

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