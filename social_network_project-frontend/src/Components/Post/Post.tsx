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
import { GetOwn } from "../../api/postsApi";

export type Comment = {
    id: number;
    text: string;
};

export type TagType = {
    id: number;
    name: string;
    color: string;
};

export type PostProps = {
    id: number;
    userId: string;
    text: string;
    image?: string | null;
    description?: string;
    tags: TagType[];
    onClick?: () => void;
};

export default function Post({ userId, text, image, description, tags, onClick }: PostProps)
{
    const [liked, setLiked] = useState(false);
    const [saved, setSaved] = useState(false);
    const [commentText, setCommentText] = useState("");
    const [isQuickEmojisOpen, setIsQuickEmojisOpen] = useState(false);

    const quickEmojis = ["🔥", "😂", "❤️", "👍", "😢", "😀"];
    const addEmoji = (emoji: string) => {
        setCommentText(prev => prev + emoji);
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

                    <div className="nicknamePost">
                        User Nickname
                    </div>

                    <div className="usernamePost">
                        @username
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
    </>;
}