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
import type { PostProps, User } from "../../types/Types";
import { useNavigate } from "react-router-dom";
import Loader from "../loader/Loader";
import { GetUserProfile } from "../../api/userApi";

export default function Post(
{       userId,
        text,
        image,
        description,
        tags,
        onClick
    }: PostProps)
{
    const navigate = useNavigate();
    const [liked, setLiked] = useState(false);
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

    const loadUser = async (userId: string) =>
    {
        const res = await GetUserProfile(userId);
        setUser(res);
        // console.log(res);
    };

    // useEffect(() =>
    // {
    //     loadOwn(userId);
    // }, []);

    // const loadOwn = async (userId: string) =>
    // {
    //     const res = await GetOwn(userId);

    //     console.log(res);
    // };

    const sendComment = () =>
    {
        if (!commentText.trim()) return;

        // setComments(prev => [
        //     ...prev,
        //     { id: Date.now(), text: commentText }
        // ]);

        setCommentText("");
    };

    // console.log(user);

    if (!user)
    {
        return <Loader/>;
    }
    return <>
        {/* {loadOwn(userId)} */}
        
        <div className="postContainer" onClick={onClick}>
            
            <div className="userHeaderPost">
                <Avatar
                    className="userAvatarPost"
                    size={40}
                >
                    U
                </Avatar>

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
            

            {image && <img className="postImage" src={image} />}

            {description && <div className="postDesc">{description}</div>}

            <div className="postActions">

                <Button
                    type="text"
                    icon={liked ? <LikeFilled /> : <LikeOutlined />}
                    onClick={(e) => {
                        setLiked(!liked);
                        e.stopPropagation();
                    }}
                />

                <Button
                    type="text"
                    icon={<MessageOutlined />}
                />

                <Button
                    type="text"
                    icon={saved ? <StarFilled/> : <StarOutlined/>}
                    onClick={(e) => {
                        setSaved(!saved);
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
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Write a comment..."
                    className="commentField"
                    onFocus={() => setIsQuickEmojisOpen(true)}
                    onClick={(e) => e.stopPropagation()}
                    // onBlur={() => setIsQuickEmojisOpen(false)}
                    // onBlur={() => {
                    //     setTimeout(() => setIsQuickEmojisOpen(false), 150);
                    // }}
                />

                <Button
                    type="text"
                    className="sendBtn"
                    icon={<SendOutlined />}
                    onClick={(e) => {
                        sendComment;
                        e.stopPropagation();
                    }}
                />
            </div>

        </div>
    </>
}