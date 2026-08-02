import { Button, Input, Modal } from "antd";
import "./SettingsModalStyle.css";
import type { User } from "../../types/Types";
import { DeleteAccount, EditProfile, Signout } from "../../api/userApi";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { AlertModal } from "../Alert/Alert";
import Base64 from "../../shared/Base64/Base64";

export default function SettingsModal({
    open,
    onClose,
    User
}: {
    open: boolean;
    onClose: () => void;
    User: User
}) {
    const [signoutOpen, setSignoutOpen] = useState(false);

    const [deleteAccOpen, setDeleteAccOpen] = useState(false);
    const [deleteErrorOpen, setDeleteErrorOpen] = useState(false);

    const [changePasswordOpen, setChangePasswordOpen] = useState(false);
    const [changePasswordErrorOpen, setChangePasswordErrorOpen] = useState(false);
    const [changePasswordSuccessfullyOpen, setChangePasswordSuccessfullyOpen] = useState(false);
    const [newPassword, setNewPassword] = useState("");

    const [changeEmailSuccessfullyOpen, setChangeEmailSuccessfullyOpen] = useState(false);
    const [changeEmailErrorOpen, setChangeEmailErrorOpen] = useState(false);
    const [email, setEmail] = useState("");
    
    const [confirmText, setConfirmText] = useState("");
    const navigate = useNavigate();
    

    const CheckSignout = async () =>
    {
        const res = await Signout();
        if(res.status.isOk === true) {
            navigate("/");
        }
    };

    const CheckDeleteAcc = async () => {
        try {
            const data = Base64.encode(User.login + ":" + confirmText);
            const res = await DeleteAccount(data);

            if (res.status.isOk === true) {
                navigate("/");
            }
            else {
                setDeleteErrorOpen(true);
            }
        }
        catch(err) {
            console.log(err);
            setDeleteErrorOpen(true);
        }
    };

    const ChangeEmail = async () =>
    {
        if(email) {
            const res = await EditProfile({Email: email});
            if(res.status.isOk === true) {
                setEmail("");
                setChangeEmailSuccessfullyOpen(true);
            }
            else {
                setChangeEmailErrorOpen(true);
            }
        }
        
    };

    const ChangePassword = async () =>
    {
        try {
            const oldPass = Base64.encode(User.login + ":" + confirmText);
            const newPass = Base64.encode(User.login + ":" + newPassword);
            const res = await EditProfile({
                OldBase64Password: oldPass,
                Base64Password: newPass
            });

            if (res.status.isOk === true) {
                setChangePasswordSuccessfullyOpen(true);
                setChangePasswordOpen(false);
                setConfirmText("");
                setNewPassword(""); 
            }
            else {
                setChangePasswordErrorOpen(true);
            }
        }
        catch(err) {
            console.log(err);
            setChangePasswordErrorOpen(true);
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
                        placeholder="New email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <Button block className="primaryBtn" onClick={ChangeEmail}>
                    Change Email
                </Button>

                <div className="settingRow">
                    <label>Password</label>
                    <Input.Password
                        className="settingsInput" 
                        placeholder="New password" 
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                </div>

                <Button
                    block
                    className="primaryBtn"
                    onClick={() => setChangePasswordOpen(true)}
                >
                    Change Password
                </Button>

                <h3 className="settingsSection">Manage account</h3>

                <Button
                    block
                    className="logoutBtn"
                    onClick={() => setSignoutOpen(true)}
                >
                    Sign Out
                </Button>

                <Button
                    danger
                    block
                    className="deleteBtn"
                    onClick={() => setDeleteAccOpen(true)}
                >
                    Delete Account
                </Button>

                <AlertModal
                    open={changeEmailSuccessfullyOpen}
                    title="Successfully"
                    message="Your email was successfully changed."
                    buttons={["ok"]}
                    onAction={() => {
                        setChangeEmailSuccessfullyOpen(false);
                    }}
                    onClose={() => setChangeEmailSuccessfullyOpen(false)}
                />
                <AlertModal
                    open={changeEmailErrorOpen}
                    title="Oops..."
                    message="Something went wrong. Check your email and try again."
                    buttons={["ok"]}
                    onAction={() => {
                        setChangeEmailErrorOpen(false);
                    }}
                    onClose={() => setChangeEmailErrorOpen(false)}
                />

                <AlertModal
                    open={signoutOpen}
                    title="Sign Out"
                    message="Are you sure you want to sign out?"
                    buttons={["cancel", "confirm"]}
                    onAction={(action) => {
                        if (action === "confirm") {
                            CheckSignout();
                        }

                        setSignoutOpen(false);
                    }}
                    onClose={() => setSignoutOpen(false)}
                />
                <AlertModal
                    open={deleteAccOpen}
                    title="Delete Account"
                    message="This action cannot be undone. Enter your password to continue."
                    buttons={["cancel", "delete"]}

                    confirmInput={{
                        placeholder: "Password",
                        value: confirmText
                    }}

                    onInputChange={setConfirmText}
                    
                    onAction={async (action) => {
                        if (action === "delete") {
                            await CheckDeleteAcc();
                            return;
                        }

                        if (action === "cancel") {
                            setConfirmText("");
                            setDeleteAccOpen(false);
                        }
                    }}

                    onClose={() => {
                        setConfirmText("");
                        setDeleteAccOpen(false);
                    }}
                />
                <AlertModal
                    open={deleteErrorOpen}
                    title="Oops..."
                    message="Something went wrong. Check your password and try again."
                    buttons={["ok"]}
                    onAction={() => {
                        setDeleteErrorOpen(false);
                    }}
                    onClose={() => setDeleteErrorOpen(false)}
                />

                <AlertModal
                    open={changePasswordOpen}
                    title="Change Password"
                    message="Enter your current password to continue."
                    buttons={["cancel", "confirm"]}

                    confirmInput={{
                        placeholder: "Password",
                        value: confirmText,
                    }}

                    onInputChange={setConfirmText}
                    
                    onAction={async (action) => {
                        if (action === "confirm") {
                            await ChangePassword();
                            return;
                        }

                        if (action === "cancel") {
                            setConfirmText("");
                            setChangePasswordOpen(false);
                        }
                    }}

                    onClose={() => {
                        setConfirmText("");
                        setChangePasswordOpen(false);
                    }}
                />
                <AlertModal
                    open={changePasswordErrorOpen}
                    title="Oops..."
                    message="Something went wrong. Check your password and try again."
                    buttons={["ok"]}
                    onAction={() => {
                        setChangePasswordErrorOpen(false);
                    }}
                    onClose={() => setChangePasswordErrorOpen(false)}
                />
                <AlertModal
                    open={changePasswordSuccessfullyOpen}
                    title="Successfully"
                    message="Your password was successfully changed."
                    buttons={["ok"]}
                    onAction={() => {
                        setChangePasswordSuccessfullyOpen(false);
                    }}
                    onClose={() => setChangePasswordSuccessfullyOpen(false)}
                />

            </div>
        </Modal>
    );
}