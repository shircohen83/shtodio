import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import angleLeftIcon from "../assets/icons/angle-left.svg";

interface NavigationState {
  returnTo?: string;
}

const SignUpPage = () => {
  const navigate = useNavigate();/* allows moving to a different page from inside a function */
  const location = useLocation();/* allows accessing information from the previous page */

  const navigationState = location.state as NavigationState | null;
  const returnTo = navigationState?.returnTo;

  const [formData, setFormData] = useState({/*this object holds what the user typed */
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

  const handleChange = (field: string, value: string) => {
    /*after every change of information from any field in the form, tha value gets updated in formData obj */
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

      navigate("/login", {
        state: {
          returnTo,
        },
      });
    } catch (error) {
      console.error("Failed to create client:", error);
      setError("לא הצלחנו ליצור את המשתמש");
    }
  };

  return (
    <main className="signup-page">
      <Link to="/login" state={{ returnTo }} className="back-icon" title="חזרה">
        <img src={angleLeftIcon} alt="" />
      </Link>

      <h1>יצירת משתמש חדש</h1>

      <section className="signup-card">
        <label>
          תעודת זהות
          <input
            value={formData.id}
            onChange={(event) =>
              handleChange("id", event.target.value)
            }
          />
        </label>

        <label>
          שם משתמש
          <input
            value={formData.username}
            onChange={(event) =>
              handleChange("username", event.target.value)
            }
          />
        </label>

        <label>
          סיסמה
          <input
            type="password"
            value={formData.password}
            onChange={(event) =>
              handleChange("password", event.target.value)
            }
          />
        </label>

        <label>
          שם ההורה
          <input
            value={formData.parentName}
            onChange={(event) =>
              handleChange("parentName", event.target.value)
            }
          />
        </label>

        <label>
          טלפון
          <input
            type="tel"
            value={formData.phone}
            onChange={(event) =>
              handleChange("phone", event.target.value)
            }
          />
        </label>

        <label>
          אימייל — לא חובה
          <input
            type="email"
            value={formData.email}
            onChange={(event) =>
              handleChange("email", event.target.value)
            }
          />
        </label>

        <label>
          שם הילד
          <input
            value={formData.kidName}
            onChange={(event) =>
              handleChange("kidName", event.target.value)
            }
          />
        </label>

        <label>
          גיל הילד
          <input
            type="number"
            value={formData.kidAge}
            onChange={(event) =>
              handleChange("kidAge", event.target.value)
            }
          />
        </label>

        {error && <p>{error}</p>}

        <button type="button" onClick={handleSubmit}>
          יצירת משתמש
        </button>
      </section>
    </main>
  );
};

export default SignUpPage;