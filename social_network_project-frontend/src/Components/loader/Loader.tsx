import { Spin } from "antd";
import "./LoaderStyle.css";

export default function Loader()
{
    return (
        <div className="loaderScreen">
            <Spin size="large" />
            <div className="loaderText">Loading...</div>
        </div>
    );
}