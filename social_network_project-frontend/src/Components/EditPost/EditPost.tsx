import { Button, Input, Modal, Radio } from "antd";
import "../AddPost/AddPostStyle.css";
import { InboxOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import { useEffect, useState } from "react";
import Dragger from "antd/es/upload/Dragger";
import { GetAdditionalInfo } from "../../api/userApi";
import type { interes, PostProps } from "../../types/Types";
import Loader from "../loader/Loader";
import { EditPostApi } from "../../api/postsApi";
import { AlertModal } from "../Alert/Alert";

interface EditPostProps extends PostProps {
    open: boolean;
    onClose: () => void;
}

export default function EditPost({ 
    open,
    onClose,
    id,
    text,
    imageUrl,
    description,
    tags,
}: EditPostProps )
{
    const [Title, setTitle] = useState("");
    const [Description, setDescription] = useState("");
    const [SelectedTags, setSelectedTags] = useState<string[]>([]);
    const [isPrivate, setIsPrivate] = useState(false);
    const [Image, setImage] = useState(null);
    const [imageUrlLocal, setimageUrlLocal] = useState(imageUrl);
    const [interests, setInterests] = useState<Array<interes>>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saveChangesErrorOpen, setSaveChangesErrorOpen] = useState(false);

    const [Errors, setErrors] = useState({
        title: "",
        tags: ""
    });

      useEffect(() => {
        const fetchAdditionalInfo = async () => {
            try {
                setLoading(true);
    
                const info = await GetAdditionalInfo();
    
                setInterests(info.data.interests);
            }
            finally {
                setLoading(false);
            }
        };
          fetchAdditionalInfo();
      }, []);

    useEffect(() => {
        if (open && tags) {
            setSelectedTags(tags.map(tag => tag.id));
        }
    }, [open, tags]);

    const toggleTag = (tagId: string) =>
    {
        if (SelectedTags.includes(tagId)) {
            if (SelectedTags.length <= 3) {
                return;
            }
            setSelectedTags(SelectedTags.filter(t => t !== tagId));
        }            
        else
            setSelectedTags([...SelectedTags, tagId]);
    };

    const handleSubmit = async () =>
    {
        try
        {
            setSaving(true);

            let res = await EditPostApi({
                PostId: id,
                Title: Title || undefined,
                PostImage: Image || undefined,
                Bio: Description || undefined,
                Interests: SelectedTags,
                IsPrivate: isPrivate ? "True" : "False"
            });

            if(res.status.isOk === false) {
                throw console.error();
            }
            console.log(res);

            resetForm();
            onClose();
            window.location.reload();
        }
        catch(error)
        {
            setSaveChangesErrorOpen(true);
        }
        finally {
            setSaving(false);
        }

        console.log({ Title, Description, SelectedTags, isPublic: isPrivate, Image });
    };

    const resetForm = () =>
    {
        setTitle("");
        setDescription("");
        setSelectedTags([]);
        setIsPrivate(false);
        setImage(null);

        setErrors({
            title: "",
            tags: ""
        });
    };

    if(loading) {
        return <Loader/>
    }
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
                        Title
                    </label>

                    <div className="inputWrapper">
                        <Input
                            value={Title}
                            maxLength={50}
                            onChange={(e) => setTitle(e.target.value)}
                            className={`postInput ${Errors.title ? "error" : ""}`}
                            placeholder={text}
                        />

                        <span className="charCounter">
                            {Title.length}/50
                        </span>
                    </div>

                    {Errors.title && <div className="errorText">{Errors.title}</div>}
                </div>

                {/* Dragger----------------------------------------------------- */}
                {(!Image && !imageUrlLocal) && (
                    <Dragger
                        className="uploadDragger"
                        beforeUpload={(file: any) =>
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

                {imageUrlLocal && (
                    <div className="previewWrapper">
                        <img
                            src={imageUrl!}
                            className="previewImage"
                        />

                        <div
                            className="removeImageBtn"
                            onClick={() => setimageUrlLocal("")}
                        >
                            ✕
                        </div>
                    </div>
                )}

                <div className="inputWrapper">
                    <TextArea
                        placeholder={description}
                        value={Description}
                        maxLength={500}
                        onChange={(e) => setDescription(e.target.value)}
                        className="postInput"
                        rows={3}
                    />

                    <span className="charCounterDesc">
                        {Description.length}/500
                    </span>
                </div>
                
                <div className="formField">

                    <label>
                        Tags
                    </label>
                    
                    <div className="interestContainer">
                        {interests.map(tag => (
                            <Button
                                key={tag.name}
                                className={`interestBtn ${SelectedTags.includes(tag.id) ? "active" : ""}`}
                                onClick={() => toggleTag(tag.id)}
                                style={{ "--interest-color": tag.color } as React.CSSProperties}
                            >
                                {tag.emoji} {tag.name}
                            </Button>
                        ))}
                    </div>

                    {Errors.tags && <div className="errorText">{Errors.tags}</div>}
                </div>
                

                <Radio.Group
                    value={isPrivate}
                    onChange={(e) => setIsPrivate(e.target.value)}
                >
                    <Radio value={false}>Public</Radio>
                    <Radio value={true}>Only my race</Radio>
                </Radio.Group>

                <div className="createPostBtnContainer">
                    <Button
                        className="createPostBtn"
                        type="primary"
                        block
                        loading={saving}
                        onClick={handleSubmit}
                    >
                        Save Changes
                    </Button>
                </div>
                

            </div>

        </Modal>

        <AlertModal
            open={saveChangesErrorOpen}
            title="Oops..."
            message="Something went wrong. Check your connection or try again."
            buttons={["ok"]}
            onAction={() => {
                setSaveChangesErrorOpen(false);
            }}
            onClose={() => setSaveChangesErrorOpen(false)}
        />
    </>;
}