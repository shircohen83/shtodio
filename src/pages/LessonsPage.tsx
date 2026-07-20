import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import "./LessonsPage.css";
import angleRightIcon from "../assets/icons/angle-right.svg";
import { useLocation, useNavigate } from "react-router";

type Lesson = {
  id: number;
  lessonType: string;
  title: string;
  description: string;
  day: number;
  startHour: number;
  duration: number;
};

const dayNames = [
  "ראשון",
  "שני",
  "שלישי",
  "רביעי",
  "חמישי",
  "שישי",
];

const LessonsPage = () => {

  const navigate = useNavigate();
  const location = useLocation();

  const { lessonId } = useParams(); /*receiving the id of the class from the url */

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const getLesson = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/lessons/${lessonId}`,
        );

        if (!response.ok) {
          throw new Error("Failed to get lesson");
        }

        const lessonData: Lesson = await response.json();
        setLesson(lessonData);
      } catch (error) {
        console.error("Failed to get lesson:", error);
        setError("לא הצלחנו למצוא את החוג שחיפשת.");
      }
    };

    getLesson();
  }, [lessonId]);

  if (error) {
    return (
      <main className="lesson-page">
        <Link to="/" className="back-icon" title="חזרה">
          <img src={angleRightIcon} alt="" />
        </Link>

        <section className="lesson-info-card">
          <h1>החוג לא נמצא</h1>
          <p>{error}</p>
        </section>
      </main>
    );
  }

  if (!lesson) {
    return (
      <main className="lesson-page">
        <p>טוען...</p>
      </main>
    );
  }

  return (
    <main className="lesson-page">
      <Link to="/" className="back-icon" title="חזרה">
        <img src={angleRightIcon} alt="" />
      </Link>

      <section className="lesson-info-card">
        <h1>{lesson.title}</h1>

        <p className="lesson-schedule">
          ימי {dayNames[lesson.day]} בשעה {lesson.startHour}:00
        </p>

        <p>{lesson.description}</p>
      </section>
      
      <button type="button" className="register-button" 
              onClick={() => navigate("/login", { state: { returnTo: location.pathname,},})}>
        <h2>הרשמה לשיעור </h2>
      </button>
    </main>
  );
};

export default LessonsPage;