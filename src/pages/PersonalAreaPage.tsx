import { useState } from "react";
import { useNavigate } from "react-router";

import loginIcon from "../assets/icons/login.svg";
import logoutIcon from "../assets/icons/logout.svg";
import notificationIcon from "../assets/icons/bell-notification.svg";
import calendarIcon from "../assets/icons/calendar.svg";

import "./PersonalAreaPage.css";

type Client = {
  id: string;
  username: string;
  parentName: string;
};

type PersonalTab = "account" | "messages" | "schedule";

const PersonalAreaPage = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<PersonalTab>("account");

  const [loggedInClient, setLoggedInClient] = useState<Client | null>(() => {
      const savedClient =
        localStorage.getItem("loggedInClient");

      return savedClient
        ? JSON.parse(savedClient)
        : null;
    });

  const handleLogout = () => {
    localStorage.removeItem("loggedInClient");
    setLoggedInClient(null);
  };

  const handleLogin = () => {
    navigate("/login", {
      state: {
        returnTo: "/personal-area",
      },
    });
  };

  return (
    <main className="personal-area-page">
      <h1>אזור אישי</h1>

      <section className="personal-tabs">
        <button
          type="button"
           className={`personal-tab ${activeTab === "account" ? "active-tab" : ""}`}
          onClick={() => setActiveTab("account")}
        >
          <img src={ loggedInClient ? logoutIcon : loginIcon} alt="log in icon"/>
          <span> {loggedInClient ? "פרטי התחברות" : "התחברות"} </span>

        </button>

        <button
          type="button"
          className={`personal-tab ${activeTab === "messages" ? "active-tab" : ""}`}
          onClick={() => setActiveTab("messages")}
        >
          <img src={notificationIcon} alt="empty notifications icon" />
          <span>הודעות</span>
        </button>

        <button
          type="button"
          className={`personal-tab ${activeTab === "schedule" ? "active-tab" : ""}`}
          onClick={() => setActiveTab("schedule")}
        >
          <img src={calendarIcon} alt="" />
          <span>מערכת שעות</span>
        </button>
      </section>

      <section className="personal-content">
        {activeTab === "account" && (
          <>
            {loggedInClient ? (
              <>
                <h2>פרטי התחברות</h2>

                <p>
                  שם משתמש:{" "}
                  {loggedInClient.username}
                </p>

                <p>
                  שם ההורה:{" "}
                  {loggedInClient.parentName}
                </p>

                <button
                  type="button"
                  className="cancel-button"
                  onClick={handleLogout}
                >
                  התנתקות
                </button>
              </>
            ) : (
              <>
                <h2>התחברות</h2>

                <p>
                  יש להתחבר כדי לצפות בפרטים
                  האישיים.
                </p>

                <button
                  type="button"
                  className="register-button"
                  onClick={handleLogin}
                >
                  <h2>התחברות</h2>
                </button>
              </>
            )}
          </>
        )}

        {activeTab === "messages" && (
          <>
            <h2>הודעות אישיות</h2>

            {loggedInClient ? (
              <p>אין כרגע הודעות חדשות.</p>
            ) : (
              <p>
                יש להתחבר כדי לצפות בהודעות.
              </p>
            )}
          </>
        )}

        {activeTab === "schedule" && (
          <>
            <h2>מערכת השעות שלי</h2>

            {loggedInClient ? (
              <p>עדיין לא נרשמת לשיעורים.</p>
            ) : (
              <p>
                יש להתחבר כדי לצפות במערכת
                השעות.
              </p>
            )}
          </>
        )}
      </section>
    </main>
  );
};

export default PersonalAreaPage;