import { Routes, Route } from "react-router-dom";
import LoginPage from "../page/LoginPage";
import MainPage from "../page/MainPage";
import SignUpPage from "../page/SignUpPage";
import SummaryPage from "../page/SummaryPage";
import SummaryDetailPage from "../page/SummaryDetailPage";
import SummaryWritePage from "../page/SummaryWritePage";
import SchedulePage from "../page/SchedulePage";



export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<SignUpPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/main" element={<MainPage />} />
     
      <Route path="/summary" element={<SummaryPage />} />   {/* 추가 */}
      <Route path="/summary/:id" element={<SummaryDetailPage />} /> {/* 추가 */}
      <Route path="/summary/write" element={<SummaryWritePage />} />

      <Route path="/schedule" element={<SchedulePage />} />

    </Routes>
  );
}



