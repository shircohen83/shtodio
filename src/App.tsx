import "./styles/design-system.css";

import { Routes, Route } from "react-router";
import HomePage from "./pages/HomePage";
import LessonsPage from "./pages/LessonsPage";


function App() {
  return (
   <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/lessons/:lessonId" element={<LessonsPage />} />
      {/* <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} /> */}
  </Routes>
  );
}

export default App;