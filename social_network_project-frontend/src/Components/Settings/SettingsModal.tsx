import { Button, Input, Modal } from "antd";
import "./SettingsModalStyle.css";
import type { User } from "../../types/Types";
import { EditProfile, Signout } from "../../api/userApi";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function SettingsModal({
    open,
    onClose,
    User
}: {
    open: boolean;
    onClose: () => void;
    User: User
}) {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");

    const CheckSignout = async () =>
    {
        const res = await Signout();
        if(res.status.isOk === true) {
            navigate("/");
        }
    };

    const ChangeEmail = async () =>
    {
        if(email) {
            const res = await EditProfile({Email: email});
            if(res.status.isOk === true) {
                setEmail("");
                alert("Successfully changed email");
            }
        }
        
    };

    return (
        <Modal
            open={open}
            onCancel={onClose}
            footer={null}
            width={500}
            centered
            wrapClassName="settingsModal"
        >
            <div className="settingsContainer">
                <h1 className="settingsMainLabel">Settings</h1>
                
                <h3 className="settingsSection">Account & Security</h3>

                <div className="settingRow">
                    <label>Email</label>
                    <Input 
                        className="settingsInput"
                        placeholder={User.email ? User.email : "user@email.com"}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <Button block className="primaryBtn" onClick={ChangeEmail}>
                    Change Email
                </Button>

                <div className="settingRow">
                    <label>Password</label>
                    <Input className="settingsInput" placeholder="●●●●●●●●" />
                </div>

                <Button block className="primaryBtn">
                    Change Password
                </Button>

                <h3 className="settingsSection">Manage account</h3>

                <Button
                    block
                    className="logoutBtn"
                    onClick={CheckSignout}
                >
                    Sign Out
                </Button>

                <Button
                    danger
                    block
                    className="deleteBtn"
                >
                    Delete Account
                </Button>

            </div>
        </Modal>
    );
}