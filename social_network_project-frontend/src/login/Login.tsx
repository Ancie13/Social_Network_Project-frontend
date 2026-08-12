import { Link, useNavigate } from "react-router-dom";
import "./LoginStyle.css";
import { Button, Form, Input } from "antd";
import logo from "../assets/logo_holder.png";
import preview from "../assets/Preview.webp";
import Base64 from "../shared/Base64/Base64";
import { SignIn } from "../api/userApi";
import { useEffect, useState } from "react";
import { AlertModal } from "../Components/Alert/Alert";
import type { FormProps } from "antd";

type LoginValues = {
    login: string;
    password: string;
};

export default function LoginPage() {
    const [loginErrorOpen, setLoginErrorOpen] = useState(false);
    

  const toggleLogin: FormProps<LoginValues>["onFinish"] = async (values) => {
    const data = "Basic " + Base64.encode(values.login + ":" + values.password);
    try {
      const res = await SignIn(data);
      if (res.status.isOk === true) {
        navigate("/home");
      }
      else {
        setLoginErrorOpen(true);
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.log(errorMessage);
    }
  };

  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Login | EtherLink";
  }, []);

  return (
    <>
      <div className="loginWrapper">
        <img src={logo} alt="logo" className="logoLogin" />
        <div className="previewBoxLogin">
          <span>Enjoy speaking in EtherLink with your friends!</span>
          <img src={preview} alt="preview" className="previewLogin" />
        </div>

        <div className="loginContainer">
          <h2 className="loginTitle">Sign in</h2>
          <Form onFinish={toggleLogin}>
            <Form.Item
              name="login"
              rules={[{ required: true, message: "Enter login" }]}
            >
              <Input className="loginInput" placeholder="Login" size="large" />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: "Enter password" }]}
            >
              <Input.Password
                className="loginInput"
                placeholder="Password"
                size="large"
              />
            </Form.Item>

            <Form.Item>
              <Button
                htmlType="submit"
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
            <Link to="/registration" className="loginLink">
              Create one
            </Link>
          </div>
        </div>
      </div>

      <AlertModal
        open={loginErrorOpen}
        title="Oops..."
        message="The login or password you entered is not valid. Please try again"
        buttons={["ok"]}
        onAction={() => {
          setLoginErrorOpen(false);
        }}
        onClose={() => setLoginErrorOpen(false)}
      />
    </>
  );
}
