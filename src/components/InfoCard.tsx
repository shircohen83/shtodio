import { useState } from "react";
import "./InfoCard.css";

interface InfoCardProps {
    title: string;
    description: string;
}

const InfoCard = ({ title, description }: InfoCardProps) => {
    const [isFlipped, setIsFlipped] = useState(false);

    return (
        <div
            className={`info-card ${isFlipped ? "flipped" : ""}`}
            onClick={() => setIsFlipped((prev) => !prev)}
        >
            <div className="front">
                <h2>{title}</h2>
            </div>

            <div className="back">
                <p>{description}</p>
            </div>
        </div>
    );
};

export default InfoCard;