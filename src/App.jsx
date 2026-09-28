import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LessonPage from "./pages/LessonPage";
import ExercisesPage from "./pages/ExercisesPage";
import ExercisePlayground from "./pages/ExercisePlayground";
import FaceTest from "./pages/FaceTest";

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/lesson/:id" element={<LessonPage />} />
        <Route path="/zadania" element={<ExercisesPage />} />
        <Route path="/zadania/:slug" element={<ExercisePlayground />} />
        <Route path="/test-mimika" element={<FaceTest />} />
      </Routes>
    </BrowserRouter>
  );
}
