import { useEffect, useRef, useState } from "react";
import "./SuccessBanner.css";

const SuccessBanner = () => {
  const [message, setMessage] = useState("");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const showBanner = (event: Event) => {
      const bannerEvent = event as CustomEvent<string>;

      setMessage(bannerEvent.detail);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        setMessage("");
      }, 3000);
    };

    window.addEventListener("show-success-banner", showBanner);

    return () => {
      window.removeEventListener("show-success-banner", showBanner);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  if (!message) {
    return null;
  }

  return (
    <aside className="success-banner">
      <button
        type="button"
        className="success-banner-close"
        onClick={() => setMessage("")}
        aria-label="סגירת ההודעה"
      >
        ×
      </button>

      <h4>{message}</h4>
    </aside>
  );
};

export default SuccessBanner;