import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./login/Login";
import "./variables.css";
import RegisterPage from "./register/RegisterPage";
import AdditionalInfoPage from "./additionalInfo/AdditionalInfoPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/registration" element={<RegisterPage />} />
        <Route path="/addInfo" element={<AdditionalInfoPage />} />
      </Routes>
    </BrowserRouter>
  );
}