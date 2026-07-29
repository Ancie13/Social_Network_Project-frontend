import { useEffect, useState } from "react";
import { Avatar, Button, Input, Tag } from "antd";
import {
    LikeOutlined,
    LikeFilled,
    MessageOutlined,
    SendOutlined,
    StarFilled,
    StarOutlined,
} from "@ant-design/icons";
import "./PostStyle.css";
import avatarHolder from "../../assets/avatar_holder.jpg";
import type { PostProps, User } from "../../types/Types";
import { useNavigate } from "react-router-dom";
import Loader from "../loader/Loader";
import { GetUserProfile } from "../../api/userApi";
import { AddComment, GetPostLikes, GetPostSaves, LikePost, SavePost } from "../../api/postsApi";

export default function Post(
{       id,
        userId,
        text,
        imageUrl,
        description,
        tags,
        onClick,
        myId,
        comments
    }: PostProps)
{
    const navigate = useNavigate();
    const [likes, setLikes] = useState<Array<User> | null>(null);
    const [liked, setLiked] = useState(false);
    const [saves, setSaves] = useState<Array<User> | null>(null);
    const [saved, setSaved] = useState(false);
    const [commentText, setCommentText] = useState("");
    const [isQuickEmojisOpen, setIsQuickEmojisOpen] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    
 
    const quickEmojis = ["🔥", "😂", "❤️", "👍", "😢", "😀"];
    const addEmoji = (emoji: string) => {
        setCommentText(prev => prev + emoji);
    };
    useEffect(() =>
    {
        if (!userId) return;

        loadUser(userId);
    }, [userId]);
    useEffect(() =>
    {
        if (!id) return;

        loadPostLikes(id.toString());
        loadPostSaves(id.toString());
    }, [id]);

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
    
    const loadUser = async (userId: string) =>
    {
        const res = await GetUserProfile(userId);
        setUser(res);
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
        if (myId && likes) {
            if(likes.find(user => user.id === myId))
            {
                setLiked(true);
            }
        }
    }, [myId, likes]);

    useEffect(()  =>  { 
        if (myId && saves) {
            if(saves.find(user => user.id === myId))
            {
                setSaved(true);
            }
        }
    }, [myId, saves]);

    const sendComment = async () =>
    {
        if (!commentText.trim()) return;

        // console.log(commentText);
        // console.log(id);
        await AddComment(id, commentText);

        setCommentText("");
    };

    // console.log(user);

    if (!user || !likes)
    {
        return <Loader/>;
    }
    return <>
        
        <div className="postContainer" onClick={onClick}>
            
            <div className="userHeaderPost">
                <Avatar
                    className="userAvatarPost"
                    size={40}
                    src={user.imageUrl || avatarHolder}
                    onClick={() => {
                        navigate(`/profile/${user.login}`);
                    }}
                />

                <div className="userInfoPost">

                    <div className="nicknamePost" 
                        onClick={() => {
                            navigate(`/profile/${user.login}`);
                        }}>
                        {user.nickname}
                    </div>

                    <div className="usernamePost" onClick={() => navigate(`/profile/${user.login}`)}>
                        @{user.login}
                    </div>

                </div>
            </div>
            

            <div className="postText">{text}</div>

            <div className="tagsBox">
                {tags.map((tag) => (
                    <Tag
                        key={tag.id}
                        className="customTag"
                        style={{ "--interest-color": tag.color } as React.CSSProperties}
                    >{tag.name}</Tag>
                ))}
            </div>
            

            {imageUrl && <img className="postImage" src={imageUrl} />}

            {description && <div className="postDesc">{description}</div>}
            
            <div className="bottomPart">
                <div className="postActions">
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
                    
                    
                    <div className="likesBox">
                        <Button
                            type="text"
                            icon={<MessageOutlined />}
                        />
                        <div className="likesCount">{comments.length}</div>
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

                {/* COMMENTS */}
                {isQuickEmojisOpen && (
                    <div className="emojiBar">

                    {quickEmojis.map((emoji, i) => (
                        <button
                            key={i}
                            className="emojiBtn"
                            onClick={(e) => {
                                addEmoji(emoji);
                                setIsQuickEmojisOpen(false);
                                e.stopPropagation();
                            }}
                        >
                            {emoji}
                        </button>
                    ))}
                    </div>
                )}
                
                <div className="commentInput">
                    <Input
                        maxLength={500}
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Write a comment..."
                        className="commentField"
                        onFocus={() => setIsQuickEmojisOpen(true)}
                        onClick={(e) => e.stopPropagation()}
                        // onBlur={() => setIsQuickEmojisOpen(false)}
                        onBlur={() => {
                            setTimeout(() => setIsQuickEmojisOpen(false), 150);
                        }}
                    />

                    <Button
                        type="text"
                        className="sendBtn"
                        icon={<SendOutlined />}
                        onClick={(e) => {
                            sendComment();
                            e.stopPropagation();
                        }}
                    />
                </div>
            </div>
        </div>
    </>
}