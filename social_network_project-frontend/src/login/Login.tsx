import { Link } from "react-router-dom";
import "./LoginStyle.css";
import { Button, Form, Input } from "antd";
import logo from "../assets/logo_holder.webp";
import preview from "../assets/Preview.webp";

export default function LoginPage() {

    return <>
        <div className="loginWrapper">
            <img src={logo} alt="logo" className="logo" />
            <div className="previewBox">
                <span>Enjoy speaking in NAME with your friends!</span>
                <img src={preview} alt="preview" className="preview" />
            </div>
            

            <div className="loginContainer">
                <h2 className="loginTitle">Sign in</h2>
                <Form>
                    <Form.Item name="login" rules={[{ required: true, message: "Enter login" }]}>
                        <Input className="loginInput" placeholder="Login" size="large" />
                    </Form.Item>

                    <Form.Item name="password" rules={[{ required: true, message: "Enter password" }]}>
                        <Input.Password className="loginInput" placeholder="Password" size="large" />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            className="loginButton"
                            type="primary"
                            block
                            size="large"
                        >
                            Sign In
                        </Button>
                    </Form.Item>
                </Form>

                <div className="loginFooter">
                    No account?{" "}
                    <a href="#" className="loginLink">
                        <Link to="/registration">
                            Create one
                        </Link>
                    </a>
                </div>
            </div>
        </div>
    </>
}