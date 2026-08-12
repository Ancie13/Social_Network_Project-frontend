import { Button, Input, Modal } from "antd";
import Dragger from "antd/es/upload/Dragger";
import TextArea from "antd/es/input/TextArea";
import { InboxOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import type { interes, User } from "../../types/Types";
import "./EditProfileModalStyle.css";
import { EditProfile } from "../../api/userApi";
import { AlertModal } from "../Alert/Alert";

export default function EditProfileModal({
    User,
    open,
    onClose,
    interests
}: {
    User: User;
    open: boolean;
    onClose: () => void;
    interests: interes[];
}) {

    const [nickname, setNickname] = useState("");
    const [bio, setBio] = useState("");
    const [avatar, setAvatar] = useState<File | null>(null);
    const [currentAvatar, setCurrentAvatar] = useState<string>("");
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [removeAvatar, setRemoveAvatar] = useState(false);
    const [editProfileErrorOpen, setEditProfileErrorOpen] = useState(false);
    const [blockEditProfileBtn, setBlockEditProfileBtn] = useState(false);

    const toggleTag = (id: string) => {
        if (selectedTags.includes(id)) {
            if (selectedTags.length <= 3) {
                return;
            }

            setSelectedTags(selectedTags.filter(x => x !== id));
        } else {
            setSelectedTags([...selectedTags, id]);
        }
    };

    useEffect(() => {
        if (open && User) {
            setCurrentAvatar(User.imageUrl);
            setAvatar(null);
        }
        setSelectedTags(User.interests.map(i => i.id));
    }, [open, User]);

    const handleSave = async () => {
        try {
            setBlockEditProfileBtn(true);
            let updatedAvatar;

            if (removeAvatar) {
                updatedAvatar = null;
            } 
            else if (avatar) {
                updatedAvatar = avatar;
            }

            let res = await EditProfile({
                Avatar: updatedAvatar,
                Nickname: nickname || undefined,
                Bio: bio || undefined,
                Interests: selectedTags
            });

            if(res.status.isOk === false) {
                throw console.error();
            }

            onClose();
            window.location.reload();
        }
        catch(err) {
            setEditProfileErrorOpen(true);
        }
        finally {
            setBlockEditProfileBtn(false);
        }
    };

    return <>
        <Modal
            open={open}
            footer={null}
            centered
            width={500}
            onCancel={onClose}
            wrapClassName="editProfileModal"
        >
            <div className="createPostContainer">
            <div className="EditProfileMainTitle">Edit Profile</div>
                <div className="formField">
                    <label>Avatar</label>

                    {!avatar && !currentAvatar && (
                        <Dragger
                            className="uploadDraggerProfile"
                            beforeUpload={(file) => {
                                setAvatar(file);
                                setRemoveAvatar(false);
                                return false;
                            }}
                            showUploadList={false}
                        >
                            <p className="uploadIcon">
                                <InboxOutlined />
                            </p>

                            <p className="uploadText">
                                Click or drag avatar here
                            </p>

                            <p className="uploadHint">
                                PNG, JPG, GIF
                            </p>
                        </Dragger>
                    )}

                    {(avatar || currentAvatar) &&  (
                        <div className="avatarPreviewContainer">
                            <button
                                className="removeAvatarBtn"
                                onClick={() => {
                                    setAvatar(null);
                                    setCurrentAvatar("");
                                    setRemoveAvatar(true);
                                }}
                            >
                                ✕
                            </button>

                            <img
                                src={avatar ? URL.createObjectURL(avatar) : `${currentAvatar}?v=${Date.now()}`}
                                className="avatarPreviewAddInfo"
                            />
                        </div>
                    )}

                </div>

                <div className="formField">

                    <label>Nickname</label>

                    <div className="inputWrapper">

                        <Input
                            className="postInput"
                            value={nickname}
                            maxLength={30}
                            onChange={(e) => setNickname(e.target.value)}
                            placeholder={User.nickname}
                        />

                        <span className="charCounter">
                            {nickname.length}/30
                        </span>

                    </div>

                </div>

                <div className="formField">

                    <label>About</label>

                    <div className="inputWrapper">

                        <TextArea
                            className="postInput"
                            value={bio}
                            rows={4}
                            maxLength={200}
                            onChange={(e) => setBio(e.target.value)}
                            placeholder={User.bio ? User.bio : "Tell something about yourself..."}
                        />

                        <span className="charCounterDesc">
                            {bio.length}/200
                        </span>

                    </div>

                </div>

                <div className="formField">

                    <label>Interests</label>

                    <div className="interestContainer">

                        {interests.map(tag => (

                            <Button
                                key={tag.id}
                                className={`interestBtn ${selectedTags.includes(tag.id) ? "active" : ""}`}
                                onClick={() => toggleTag(tag.id)}
                                style={{ "--interest-color": tag.color } as React.CSSProperties}
                            >
                                {tag.emoji} {tag.name}
                            </Button>

                        ))}

                    </div>

                </div>

                <Button
                    block
                    type="primary"
                    className="createPostBtn"
                    onClick={handleSave}
                    loading={blockEditProfileBtn}
                >
                    Save Changes
                </Button>

            </div>
        </Modal>

        <AlertModal
            open={editProfileErrorOpen}
            title="Oops..."
            message="Something went wrong. Check your connection or try again."
            buttons={["ok"]}
            onAction={() => {
                setEditProfileErrorOpen(false);
            }}
            onClose={() => setEditProfileErrorOpen(false)}
        />
    </>
}