import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import angleLeftIcon from "../assets/icons/angle-left.svg";
import "./LoginPage.css";

const LoginPage = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = location.state?.returnTo || "/";

  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (field: string, value: string) => {
    setLoginData({
      ...loginData,
      [field]: value,
    });
  };

  const handleLogin = async () => {
    setError("");

    if (!loginData.username || !loginData.password) {
      setError("יש למלא שם משתמש וסיסמה");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message);
        return;
      }

      navigate(returnTo);
    } catch (error) {
      console.error("Failed to login:", error);
      setError("לא הצלחנו להתחבר");
    }
  };

  return (
    <main className="login-page">
      <Link to={ returnTo } className="back-icon" title="חזרה">
        <img src={angleLeftIcon} alt="" />
      </Link>
      <h1>התחברות</h1>

      <section className="login-card">
        <label>
          שם משתמש
          <input
            value={loginData.username}
            onChange={(event) =>
              handleChange("username", event.target.value)
            }
          />
        </label>

        <label>
          סיסמה
          <input
            type="password"
            value={loginData.password}
            onChange={(event) =>
              handleChange("password", event.target.value)
            }
          />
        </label>

        {error && <p className="login-error">{error}</p>}

        <button type="button" className="register-button" onClick={handleLogin}>
            <h2>התחבר</h2>
        </button>

        <p>
          עוד לא רשום במערכת?{" "}
          <Link to="/signup" state={{ returnTo }}>הירשם</Link>
        </p>
      </section>
    </main>
  );
};

export default LoginPage;