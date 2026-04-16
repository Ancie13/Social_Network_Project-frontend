import { Link } from "react-router-dom";
import "./RegisterStyle.css";
import { Button, Form, Input } from "antd";
import logo from "../assets/logo_holder.webp";
import preview from "../assets/Preview.webp";

export default function MainPage() {

    return <>
        <div className="registerWrapper">
            <img src={logo} alt="logo" className="logo" />
            <div className="previewBox">
                <span>Enjoy speaking in NAME with your friends!</span>
                <img src={preview} alt="preview" className="preview" />
            </div>
            

            <div className="registerContainer">
                <h2 className="registerTitle">Sign up</h2>
                <Form>
                    <Form.Item name="login" rules={[{ required: true, message: "Enter login" }]}>
                        <Input className="registerInput" placeholder="Login" size="large" />
                    </Form.Item>

                    <Form.Item name="email" rules={[{ required: true, message: "Enter email" }]}>
                        <Input type={"email"} className="registerInput" placeholder="Email" size="large" />
                    </Form.Item>

                    <Form.Item name="password" rules={[{ required: true, message: "Enter password" }]}>
                        <Input.Password className="registerInput" placeholder="Password" size="large" />
                    </Form.Item>

                    <Form.Item>
                        <Link to="/addInfo">
                            <Button
                                className="registerButton"
                                type="primary"
                                block
                                size="large"
                            >
                                Sign up
                            </Button>
                        </Link>
                    </Form.Item>
                </Form>

                <div className="registerFooter">
                    Already have an account?{" "}
                    <a href="#" className="registerLink">
                        <Link to="/">
                            Sign in
                        </Link>
                    </a>
                </div>
            </div>
        </div>
    </>
}