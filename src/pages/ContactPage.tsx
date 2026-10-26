import InfoCard from "../components/InfoCard";

import "./ContactPage.css";

const ContactPage = () => {
  return (
    <main className="contact-page">

      <h1>צור קשר</h1>

      <div className="contact-info-cards">
        <InfoCard
          title="פרטי קשר"
          description="טלפון: 04-5551234 | אימייל: info@shtodio.co.il | כתובת: רחוב הספורט 15, חיפה"
        />

        <InfoCard
          title="הגעה וחניה"
          description="ניתן לחנות ברחוב בסביבת הסטודיו. בנוסף, קיים חניון ציבורי במרחק הליכה קצר. תחנת אוטובוס נמצאת בקרבת הסטודיו."
        />

        <InfoCard
          title="שעות פעילות"
          description="ימים א׳–ה׳: 09:00–20:00 | יום ו׳: 09:00–13:00 | שבת: סגור"
        />
      </div>
    </main>
  );
};

export default ContactPage;