import { useState } from "react";
import { Button, Input } from "antd";
import {
    LikeOutlined,
    LikeFilled,
    MessageOutlined,
    SendOutlined,
    StarFilled,
    StarOutlined,
    CloseOutlined,
    SmileOutlined
} from "@ant-design/icons";
import "./PostStyle.css";
import EmojiPicker from "emoji-picker-react";

type Comment = {
    id: number;
    text: string;
};

type PostProps = {
    id: number;
    text: string;
    image?: string | null;
};

export default function Post({ text, image }: PostProps)
{
    const [liked, setLiked] = useState(false);
    const [saved, setSaved] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [commentText, setCommentText] = useState("");
    const [isQuickEmojisOpen, setIsQuickEmojisOpen] = useState(false);
    const [isPickerOpen, setIsPickerOpen] = useState(false);

    const quickEmojis = ["🔥", "😂", "❤️", "👍", "😢", "😀"];
    const addEmoji = (emoji: string) => {
        setCommentText(prev => prev + emoji);
    };

    const [comments, setComments] = useState<Comment[]>([
        { id: 1, text: "Nice 🔥" },
        { id: 2, text: "Cool post!" }
    ]);

    const sendComment = () =>
    {
        if (!commentText.trim()) return;

        setComments(prev => [
            ...prev,
            { id: Date.now(), text: commentText }
        ]);

        setCommentText("");
    };

    return (
        <div className="postContainer">

            <div className="postText">{text}</div>

            {image && <img className="postImage" src={image} />}

            <div className="postActions">

                <Button
                    type="text"
                    icon={liked ? <LikeFilled /> : <LikeOutlined />}
                    onClick={() => setLiked(!liked)}
                />

                <Button
                    type="text"
                    icon={<MessageOutlined />}
                    onClick={() => setShowComments(v => !v)}
                />

                <Button
                    type="text"
                    icon={saved ? <StarFilled/> : <StarOutlined/>}
                    onClick={() => setSaved(!saved)}
                />
            </div>

            {/* COMMENTS */}
            {showComments && (
                <div className="commentsBox">

                    {comments.map(c => (
                        <div key={c.id} className="comment">
                            {c.text}
                        </div>
                    ))}

                </div>
            )}
            {isQuickEmojisOpen && (
                <div className="emojiBar">

                {quickEmojis.map((emoji, i) => (
                    <button
                        key={i}
                        className="emojiBtn"
                        onClick={() => addEmoji(emoji)}
                    >
                        {emoji}
                    </button>
                ))}

                <button
                    className="emojiBtn pickerBtn"
                    onClick={() => setIsPickerOpen(v => !v)}
                >
                    {isPickerOpen ? <CloseOutlined /> : <SmileOutlined /> }
                </button>
                {isPickerOpen && (
                    <div className="emojiWrapper">
                        <div className="emojiPicker">
                            <EmojiPicker
                                className="EmojiPickerReact"
                                onEmojiClick={(emoji) => {
                                    setCommentText(prev => prev + emoji.emoji);
                                    setIsPickerOpen(false);
                                }}
                            />
                        </div>
                    </div>
                    
                )}
                </div>
            )}
            
            <div className="commentInput">
                <Input
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Write a comment..."
                    className="commentField"
                    onFocus={() => setIsQuickEmojisOpen(true)}
                    // onBlur={() => {
                    //     setTimeout(() => setIsQuickEmojisOpen(false), 150);
                    // }}
                />

                <Button
                    type="text"
                    className="sendBtn"
                    icon={<SendOutlined />}
                    onClick={sendComment}
                />
            </div>

        </div>
    );
}