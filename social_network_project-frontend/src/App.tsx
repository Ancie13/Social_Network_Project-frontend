import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./login/Login";
import "./variables.css";
import RegisterPage from "./register/RegisterPage";
import AdditionalInfoPage from "./additionalInfo/AdditionalInfoPage";
import MainPage from "./main/MainPage";
import HomePage from "./main/home/HomePage";
import ProfilePage from "./main/profile/ProfilePage";
import MessagesPage from "./main/messages/MessagesPage";
import LikesPage from "./main/likes/LikesPage";
import SavedPage from "./main/saved/SavedPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
                <Route path="/registration" element={<RegisterPage />} />
                <Route path="/addInfo" element={<AdditionalInfoPage />} />

                <Route element={<MainPage />}>
                        <Route path="/home" element={<HomePage />} />
                        <Route path="/profile" element={<ProfilePage />} />
                        <Route path="/messages" element={<MessagesPage />} />
                        <Route path="/likes" element={<LikesPage />} />
                        <Route path="/saved" element={<SavedPage />} />
                </Route>

      </Routes>
    </BrowserRouter>
  );
}