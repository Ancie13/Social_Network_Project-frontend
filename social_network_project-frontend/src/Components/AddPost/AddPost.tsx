import { Button, Input, Modal, Radio } from "antd";
import "./AddPostStyle.css";
import { InboxOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import { useState } from "react";
import Dragger from "antd/es/upload/Dragger";
import { AddPostApi } from "../../api/userApi";

export default function AddPost({ open, onClose })
{
    const [Title, setTitle] = useState("");
    const [Description, setDescription] = useState("");
    const [SelectedTags, setSelectedTags] = useState([]);
    const [Visibility, setVisibility] = useState("public");
    const [Image, setImage] = useState(null);

    // const [data, setData] = useState({
    //     UserId: "",
    //     Title: "",
    //     PostImage: null as File | null,
    //     Bio: "",
    //     Interests: [] as number[]
    // });

    const [Errors, setErrors] = useState({
        title: "",
        tags: ""
    });

    const interests = [
        { name: "Sports", emoji: "⚽", color: "#3b82ff" },
        { name: "Books", emoji: "📚", color: "#8b5cf6" },
        { name: "Movies", emoji: "🎬", color: "#ff3b3b" },
        { name: "Music", emoji: "🎵", color: "#ff7a3b" },
        { name: "Gaming", emoji: "🎮", color: "#22c55e" },
        { name: "Coding", emoji: "💻", color: "#06b6d4" },
        { name: "Travel", emoji: "✈️", color: "#facc15" },
        { name: "Fitness", emoji: "🏋️", color: "#ef4444" },
        { name: "Anime", emoji: "🍥", color: "#f472b6" },
        { name: "Technology", emoji: "🧠", color: "#0ea5e9" },
        { name: "Art", emoji: "🎨", color: "#a855f7" },
        { name: "Photography", emoji: "📸", color: "#14b8a6" },
        { name: "Science", emoji: "🔬", color: "#6366f1" },
        { name: "History", emoji: "🏺", color: "#b45309" },
        { name: "Cooking", emoji: "🍳", color: "#f97316" },
        { name: "Nature", emoji: "🌿", color: "#16a34a" },
        { name: "Psychology", emoji: "🧠", color: "#7c3aed" },
        { name: "Business", emoji: "💼", color: "#64748b" },
        { name: "Cars", emoji: "🚗", color: "#dc2626" },
        { name: "Space", emoji: "🚀", color: "#002f9dff" }
    ];

    const toggleTag = (tag) =>
    {
        if (SelectedTags.includes(tag))
            setSelectedTags(SelectedTags.filter(t => t !== tag));
        else
            setSelectedTags([...SelectedTags, tag]);
    };

    const handleSubmit = async () =>
    {
        let newErrors = {
            title: "",
            tags: ""
        };

        if (!Title.trim())
            newErrors.title = "Title is required";

        if (SelectedTags.length === 0)
            newErrors.tags = "Select at least 1 tag";

        setErrors(newErrors);

        if (newErrors.title || newErrors.tags)
            return;

        
        const payload = {
            UserId: "UserId",
            Title: Title,
            PostImage: Image,
            Bio: Description,
            Interests: SelectedTags
        };

        try
        {
            await AddPostApi(payload);
        }
            catch(error)
        {
            console.log(error);
        }

        console.log({ Title, Description, SelectedTags, Visibility, Image });

        resetForm();
        onClose();
    };

    const resetForm = () =>
    {
        setTitle("");
        setDescription("");
        setSelectedTags([]);
        setVisibility("public");
        setImage(null);

        setErrors({
            title: "",
            tags: ""
        });
    };

    return <>
        <Modal
            open={open}
            onCancel={onClose}
            footer={null}
            centered
            width={500}
            wrapClassName="createPostModal"
        >
            <div className="createPostContainer">

                <div className="formField">
                    <label>
                        Title <span className="required">*</span>
                    </label>

                    <Input
                        value={Title}
                        onChange={(e) => setTitle(e.target.value)}
                        className={`postInput ${Errors.title ? "error" : ""}`}
                        placeholder="Post title..."
                    />

                    {Errors.title && <div className="errorText">{Errors.title}</div>}
                </div>

                {/* Dragger----------------------------------------------------- */}
                {!Image && (
                    <Dragger
                        className="uploadDragger"
                        beforeUpload={(file) =>
                        {
                            setImage(file);
                            return false;
                        }}
                        showUploadList={false}
                    >
                        <p className="uploadIcon">
                            <InboxOutlined />
                        </p>

                        <p className="uploadText">
                            Click or drag image here
                        </p>

                        <p className="uploadHint">
                            PNG, JPG, GIF
                        </p>
                    </Dragger>
                )}

                {Image && (
                    <div className="previewWrapper">
                        <img
                            src={URL.createObjectURL(Image)}
                            className="previewImage"
                        />

                        <div
                            className="removeImageBtn"
                            onClick={() => setImage(null)}
                        >
                            ✕
                        </div>
                    </div>
                )}

                
                <TextArea
                    placeholder="Description..."
                    value={Description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="postInput"
                    rows={3}
                />
                <div className="formField">

                    <label>
                        Tags <span className="required">*</span>
                    </label>
                    
                    <div className="interestContainer">
                        {interests.map(tag => (
                            <Button
                                key={tag.name}
                                className={`interestBtn ${SelectedTags.includes(tag.name) ? "active" : ""}`}
                                onClick={() => toggleTag(tag.name)}
                                style={{ "--interest-color": tag.color } as React.CSSProperties}
                            >
                                {tag.emoji} {tag.name}
                            </Button>
                        ))}
                    </div>

                    {Errors.tags && <div className="errorText">{Errors.tags}</div>}
                </div>
                

                <Radio.Group
                    value={Visibility}
                    onChange={(e) => setVisibility(e.target.value)}
                >
                    <Radio value="public">Public</Radio>
                    <Radio value="race">Only my race</Radio>
                </Radio.Group>

                <div className="createPostBtnContainer">
                    <Button
                        className="createPostBtn"
                        type="primary"
                        block
                        onClick={handleSubmit}
                    >
                        Create Post
                    </Button>
                </div>
                

            </div>

        </Modal>
    </>;
}