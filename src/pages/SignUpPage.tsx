import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import angleRightIcon from "../assets/icons/angle-right.svg";
import "./SignUpPage.css";

const SignUpPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const returnTo = location.state?.returnTo || "/";

  const [formData, setFormData] = useState({
    id: "",
    username: "",
    password: "",
    parentName: "",
    phone: "",
    email: "",
    kidName: "",
    kidAge: "",
  });

  const [error, setError] = useState("");
  const [signupSucceeded, setSignupSucceeded] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleSubmit = async () => {
    setError("");

    if (
      !formData.id ||
      !formData.username ||
      !formData.password ||
      !formData.parentName ||
      !formData.phone ||
      !formData.kidName ||
      !formData.kidAge
    ) {
      setError("יש למלא את כל שדות החובה");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/clients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message);
        return;
      }

      localStorage.setItem(
        "loggedInClient",
        JSON.stringify(data.client),
      );

      setSignupSucceeded(true);
    } catch (error) {
      console.error("Failed to create client:", error);
      setError("לא הצלחנו ליצור את המשתמש");
    }
  };

  if (signupSucceeded) {
    return (
      <main className="signup-page">
        <section className="signup-card">
          <h1 style={{ gridColumn: "1 / -1" }}>נרשמת בהצלחה!</h1>

          <p style={{ gridColumn: "1 / -1" }}>
            המשתמש שלך נוצר בהצלחה.
            <br />
            כעת ניתן להמשיך להרשמה לשיעור.
          </p>

          <button
            type="button"
            className="register-button"
            style={{ gridColumn: "1 / -1" }}
            onClick={() => navigate(returnTo)}
          >
            <h2>חזרה לעמוד החוג</h2>
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="signup-page">
      <Link
        to="/login"
        state={{ returnTo }}
        className="back-icon"
        title="חזרה"
      >
        <img src={angleRightIcon} alt="" />
      </Link>

      <h1 >יצירת משתמש חדש</h1>

      <section className="signup-card">
        <h4>תעודת זהות</h4>
        <input
          value={formData.id}
          onChange={(event) => handleChange("id", event.target.value)}
        />

        <h4>שם משתמש</h4>
        <input
          value={formData.username}
          onChange={(event) => handleChange("username", event.target.value)}
        />

        <h4>סיסמה</h4>
        <input
          type="password"
          value={formData.password}
          onChange={(event) => handleChange("password", event.target.value)}
        />

        <h4>שם ההורה</h4>
        <input
          value={formData.parentName}
          onChange={(event) => handleChange("parentName", event.target.value)}
        />

        <h4>טלפון</h4>
        <input
          type="tel"
          value={formData.phone}
          onChange={(event) => handleChange("phone", event.target.value)}
        />

        <h4 className="optional-field">אימייל</h4>
        <input
          type="email"
          value={formData.email}
          onChange={(event) => handleChange("email", event.target.value)}
        />

        <h4>שם הילד</h4>
        <input
          value={formData.kidName}
          onChange={(event) => handleChange("kidName", event.target.value)}
        />

        <h4>גיל הילד</h4>
        <input
          type="number"
          value={formData.kidAge}
          onChange={(event) => handleChange("kidAge", event.target.value)}
        />

        {error && (
          <p
            className="error-message"
            style={{ gridColumn: "1 / -1" }}
          >
            {error}
          </p>
        )}

        <button
          type="button"
          className="register-button"
          style={{ gridColumn: "1 / -1" }}
          onClick={handleSubmit}
        >
          <h2>יצירת משתמש</h2>
        </button>
      </section>
    </main>
  );
};

export default SignUpPage;