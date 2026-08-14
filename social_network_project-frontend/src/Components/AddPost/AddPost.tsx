import { Button, Input, Modal, Radio } from "antd";
import "./AddPostStyle.css";
import { InboxOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import { useEffect, useState } from "react";
import Dragger from "antd/es/upload/Dragger";
import { AddPostApi } from "../../api/postsApi";
import { GetAdditionalInfo } from "../../api/userApi";
import type { interes } from "../../types/Types";
import Loader from "../loader/Loader";
import { AlertModal } from "../Alert/Alert";

export default function AddPost({ open, onClose }: { open: boolean; onClose: () => void })
{
    const [Title, setTitle] = useState("");
    const [Description, setDescription] = useState("");
    const [SelectedTags, setSelectedTags] = useState<string[]>([]);
    const [isPrivate, setIsPrivate] = useState(false);
    const [Image, setImage] = useState(null);
    const [interests, setInterests] = useState<Array<interes>>([]);
    const [loading, setLoading] = useState(true);
    const [blockAddPostBtn, setBlockAddPostBtn] = useState(true);
    const [addPostErrorOpen, setAddPostErrorOpen] = useState(false);
    
    // const [data, setData] = useState({
    //     UserId: "",
    //     Title: "",
    //     PostImage: null as File | null,
    //     Bio: "",
    //     Interests: [] as number[]
    // });

    useEffect(() => {

        if(SelectedTags.length >= 3 && Title.length >= 1) {
            setBlockAddPostBtn(false);
        }
        else {
            setBlockAddPostBtn(true);
        }
      }, [Title, SelectedTags]);

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
            Interests: SelectedTags,
            IsPrivate: isPrivate ? "True" :  "False"
        };

        try
        {
            setBlockAddPostBtn(true);
            let res;
            res = await AddPostApi(payload);
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
            setAddPostErrorOpen(true);
        }
        finally 
        {
            setBlockAddPostBtn(false);
        }
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
                        Title <span className="required">*</span>
                    </label>

                    <div className="inputWrapper">
                        <Input
                            value={Title}
                            maxLength={50}
                            onChange={(e) => setTitle(e.target.value)}
                            className={`postInput ${Errors.title ? "error" : ""}`}
                            placeholder="Post title..."
                        />

                        <span className="charCounter">
                            {Title.length}/50
                        </span>
                    </div>

                    {Errors.title && <div className="errorText">{Errors.title}</div>}
                </div>

                {/* Dragger----------------------------------------------------- */}
                {!Image && (
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

                <div className="inputWrapper">
                    <TextArea
                        placeholder="Description..."
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
                        Tags <span className="required">*</span>
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
                        onClick={handleSubmit}
                        loading={blockAddPostBtn}
                    >
                        Create Post
                    </Button>
                </div>
                

            </div>

        </Modal>


        <AlertModal
            open={addPostErrorOpen}
            title="Oops..."
            message="Something went wrong. Check your connection or try again."
            buttons={["ok"]}
            onAction={() => {
                setAddPostErrorOpen(false);
            }}
            onClose={() => setAddPostErrorOpen(false)}
        />
    </>;
}