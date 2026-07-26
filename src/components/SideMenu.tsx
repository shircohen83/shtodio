import { useState } from "react";
import { useLocation, useNavigate } from "react-router";

import menu from "../assets/icons/menu.svg";
import userIcon from "../assets/icons/user.svg";
import homeIcon from "../assets/icons/home.svg";
import shopIcon from "../assets/icons/shop.svg";
import rulesIcon from "../assets/icons/rules.svg";
import filmIcon from "../assets/icons/film.svg";
import phoneGuideIcon from "../assets/icons/phone-guide.svg";
import close from "../assets/icons/close.svg";

import "./SideMenu.css";

const SideMenu = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const goTo = (path: string) => {
    setIsOpen(false);
    navigate(path);
  };


  return (
    <>
      <button
        type="button"
        className="menu-button"
        onClick={() => setIsOpen(true)}
        aria-label="פתיחת תפריט"
      >
        <img src={menu} alt="פתיחת תפריט" />
      </button>

      {isOpen && (
        <>
          <button
            type="button"
            className="menu-background"
            onClick={() => setIsOpen(false)}
            aria-label="סגירת תפריט"
          />

          <aside className="side-menu">
            <button
              type="button"
              className="menu-close"
              onClick={() => setIsOpen(false)}
              aria-label="סגירת תפריט"
            >
              <img src={close} alt="סגירת תפריט" />
            </button>

            <button
              type="button"
              className="menu-row"
              onClick={() => goTo("/personal-area")}
            >
              <img src={userIcon} alt="" />
              <h3>אזור אישי</h3>
            </button>

            <button
              type="button"
              className="menu-row"
              onClick={() => goTo("/")}
            >
              <img src={homeIcon} alt="" />
              <h3>דף הבית</h3>
            </button>

            <button
              type="button"
              className="menu-row"
              onClick={() => goTo("/shop")}
            >
              <img src={shopIcon} alt="" />
              <h3>חנות מוצרים</h3>
            </button>

            <button
              type="button"
              className="menu-row"
              onClick={() => goTo("/registration-rules")}
            >
              <img src={rulesIcon} alt="" />
              <h3>תקנון הרשמה</h3>
            </button>

            <button
              type="button"
              className="menu-row"
              onClick={() => goTo("/media")}
            >
              <img src={filmIcon} alt="" />
              <h3>מדיה</h3>
            </button>

            <button
              type="button"
              className="menu-row"
              onClick={() => goTo("/contact")}
            >
              <img src={phoneGuideIcon} alt="" />
              <h3>צור קשר</h3>
            </button>
          </aside>
        </>
      )}
    </>
  );
};

export default SideMenu;