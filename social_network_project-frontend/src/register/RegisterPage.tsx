import { Link } from "react-router-dom";
import "./RegisterStyle.css";
import { Button, Form, Input } from "antd";
import logo from "../assets/logo_holder.png";
import preview from "../assets/Preview.webp";
import { useNavigate } from "react-router-dom";
import Base64 from "../shared/Base64";

export default function RegisterPage() {
    const navigate = useNavigate();

    return <>
        <div className="registerWrapper">
            <img src={logo} alt="logo" className="logo" />
            <div className="previewBox">
                <span>Enjoy speaking in EtherLink with your friends!</span>
                <img src={preview} alt="preview" className="preview" />
            </div>
            

            <div className="registerContainer">
                <h2 className="registerTitle">Sign up</h2>
                <Form
                    onFinish={(values) =>
                    {
                        const registerData = {
                            Login: values.login,
                            Email: values.email,
                            Base64Password: Base64.encode(
                                values.login + ":" + values.password
                            )
                        };

                        console.log(registerData);

                        navigate("/addInfo", {
                            state: registerData
                        });
                    }}
                >
                    <Form.Item name="login" rules={[{ required: true, message: "Enter login" }]}>
                        <Input className="registerInput" placeholder="Login" size="large" />
                    </Form.Item>

                    <Form.Item
                        name="email"
                        rules={[
                            { required: true, message: "Enter email" },
                            { type: "email", message: "Invalid email" }
                        ]}
                    >
                        <Input type={"email"} className="registerInput" placeholder="Email" size="large" />
                    </Form.Item>

                    <Form.Item name="password" rules={[{ required: true, message: "Enter password" }]}>
                        <Input.Password className="registerInput" placeholder="Password" size="large" />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            htmlType="submit"
                            className="registerButton"
                            type="primary"
                            block
                            size="large"
                        >
                            Sign up
                        </Button>
                    </Form.Item>
                </Form>

                <div className="registerFooter">
                    Already have an account?{" "}
                    <Link to="/" className="registerLink">
                        Sign in
                    </Link>
                </div>
            </div>
        </div>
    </>
}