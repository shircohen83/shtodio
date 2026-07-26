import "./styles/design-system.css";

import { Routes, Route } from "react-router";
import HomePage from "./pages/HomePage";
import LessonsPage from "./pages/LessonsPage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import SuccessBanner from "./components/SuccessBanner";
import SideMenu from "./components/SideMenu";
import PersonalAreaPage from "./pages/PersonalAreaPage";

function App() {
  return (
    <> 
      <SuccessBanner />
      <SideMenu />
      <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/lessons/:lessonId" element={<LessonsPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/personal-area" element={<PersonalAreaPage />} />
          {/* <Route path="/register" element={<RegisterPage />} /> */}
      </Routes>
  </>
  );
}

export default App;