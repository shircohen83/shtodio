import { useEffect, useState } from "react";
import logo from "../assets/images/logo.png";
import InfoCard from "../components/InfoCard";
import WeeklySchedule from "../components/WeeklySchedule";
import "./HomePage.css";

type Lesson = {
  id: number;
  lessonType: "zumba" | "kickboxing" | "general-sport";
  title: string;
  description: string;
  day: number;
  startHour: number;
  duration: number;
};

const HomePage = () => {
  const [lessons, setLessons] = useState<Lesson[]>([]);

  useEffect(() => {
    const getLessons = async () => {
      try {
        const response = await fetch("http://localhost:3000/lessons");

        if (!response.ok) {
          throw new Error("Failed to get lessons");
        }

        const lessonsData: Lesson[] = await response.json();
        setLessons(lessonsData);
      } catch (error) {
        console.error("Failed to get lessons:", error);
      }
    };

    getLessons();
  }, []);

  return (
    <main className="home-page">
      <img src={logo} alt="SHtodio Logo" className="logo" />

      <div className="info-cards-container">
        <InfoCard
          title="מי אני?"
          description="אני רוצה להנגיש ספורט לילדים כי גם אני גדלתי עם התחושה שספורט מחובר לציונים, ביצועים ולחץ."
        />

        <InfoCard
          title="מי אנחנו?"
          description="SHtodio הוא סטודיו כושר לילדים שמטרתו להפוך ספורט לחוויה כיפית, משוחררת ולא תחרותית."
        />

        <InfoCard
          title="איך מתחילים?"
          description="לוחצים על שיעור במערכת השעות, יוצרים חשבון או נכנסים לחשבון קיים ונרשמים לשיעור."
        />
      </div>

      <WeeklySchedule lessons={lessons} />
    </main>
  );
};

export default HomePage;