import "./styles/design-system.css";
import "./App.css";

import logo from "./assets/images/logo.png";
import InfoCard from "./components/InfoCard";

function App() {
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

    <section className="schedule">

    </section>
      
    </main>
  );
}

export default App;