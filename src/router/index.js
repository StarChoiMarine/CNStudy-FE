import { Routes, Route } from "react-router-dom";
import LoginPage from "../page/LoginPage";
import MainPage from "../page/MainPage";
import SignUpPage from "../page/SignUpPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<SignUpPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/main" element={<MainPage />} />
    </Routes>
  );
}