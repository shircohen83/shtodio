import { useEffect, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useParams,
} from "react-router";
import angleRightIcon from "../assets/icons/angle-right.svg";
import "./LessonsPage.css";

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

  const { lessonId } =
    useParams(); /* receiving the id of the class from the url */

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [error, setError] = useState("");
  const [showPayment, setShowPayment] = useState(false);

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

  useEffect(() => {
    const loggedInClient =
      localStorage.getItem("loggedInClient");

    if (
      loggedInClient &&
      location.state?.openRegistration
    ) {
      setShowPayment(true);
    }
  }, [location.state]);

  const handleRegistrationRequest = () => {
    const loggedInClient =
      localStorage.getItem("loggedInClient");

    if (loggedInClient) {
      setShowPayment(true);
      return;
    }
    /*if the user is not logged in, redirect to login page
      Then after login, redirect back to the lesson page and open the registration form
    */
    navigate("/login", {
      state: {
        returnTo: location.pathname,
        openRegistration: true,
      },
    });
  };
  
  /* Handle submission of the registration form */
  const handleRegistrationSubmit = async () => {
    const loggedInClient =
      localStorage.getItem("loggedInClient");

    const client = JSON.parse(loggedInClient!);

    try {
      /* reaching for the server in localhost 3000, then to registrations endpoint
        to do a POST http request which is create a new row of registration in DB
      */
      const response = await fetch(
        "http://localhost:3000/registrations",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            clientId: client.id,
            lessonId: lesson!.id,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message);
        return;
      }

      setShowPayment(false);

      window.dispatchEvent(/*activates the success banner action.
        SuccessBanner's component listens to this event and shows the banner with the message
        */
        new CustomEvent("show-success-banner", {
          detail: "נרשמת בהצלחה לשיעור!",
        }),
      );
    } catch (error) {
      console.error("Failed to register for lesson:", error);
      setError("לא הצלחנו לבצע את ההרשמה");
    }
  };

  if (error) {
    return (
      <main className="lesson-page">
        <Link
          to="/"
          className="back-icon"
          title="חזרה"
        >
          <img src={angleRightIcon} alt="" />
        </Link>

        <section className="lesson-info-card">
          <h1>לא בוצע רישום </h1>
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
      <Link
        to="/"
        className="back-icon"
        title="חזרה"
      >
        <img src={angleRightIcon} alt="arrow to the right" />
      </Link>

      <section className="lesson-info-card">
        <h1>{lesson.title}</h1>

        <p className="lesson-schedule">
          ימי {dayNames[lesson.day]} בשעה{" "}
          {lesson.startHour}:00
        </p>

        <p>{lesson.description}</p>
      </section>

     {!showPayment ? (
        <button
          type="button"
          className="register-button"
          onClick={handleRegistrationRequest}
        >
          <h2>הרשמה לשיעור</h2>
        </button>
      ) : (
        <section className="payment-card">
         
          <input
            type="text"
            placeholder="מספר כרטיס"
          />

          <section  style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1rem",}}>
            <input
              type="text"
              placeholder="תוקף"
            />

            <input
              type="text"
              placeholder="CVV"
            />
          </section>
          <section style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1rem",}}>

            <button type="button" className="register-button" onClick={handleRegistrationSubmit}>
              <h2>תפוס מקום</h2>
            </button>
            <button type="button" className="cancel-button" onClick={() => setShowPayment(false)}> 
              חזור 
            </button>

          </section>
        </section>
      )}
    </main>
  );
};

export default LessonsPage;