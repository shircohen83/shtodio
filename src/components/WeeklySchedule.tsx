import "./WeeklySchedule.css";
import { Link } from "react-router";

interface Lesson {
  id: number;
  lessonType: "zumba" | "kickboxing" | "general-sport";
  title: string;
  description: string;
  day: number;
  startHour: number;
  duration: number;
}

interface WeeklyScheduleProps {
    lessons: Lesson[];
}

const days = ["א", "ב", "ג", "ד", "ה", "ו"];

const WeeklySchedule = ({ lessons }: WeeklyScheduleProps) => {
    /* array that will contain the importent hours that are connected to a lesson and therefor needs to be presented(no doubles due to Set) */
    const boundaries = Array.from(
        new Set([
            9,
            21,
            ...lessons.flatMap((lesson) => [/*start and finish time is inserted to the array for each lesson  */
                lesson.startHour,
                lesson.startHour + lesson.duration,
            ]),
        ])
    ).sort((a, b) => a - b);/*sorting times from small to large with this activating fun that sort applies on pairs*/

    const timeSlots = boundaries.slice(0, -1).map((start, index) => ({/*slice(0, -1) is the array from 0 to the end not including the last */
        start,
        end: boundaries[index + 1],
    }));/*every pair of hours in bounderies gets a time slot to start and end according to them  */

    return (
        <section className="weekly-schedule">
            <h2>מערכת שעות</h2>

            <div className="schedule-grid">
                <div className="schedule-cell schedule-header" />

                {days.map((day) => (
                    <div className="schedule-cell schedule-header" key={day}>
                        יום {day}
                    </div>
                ))}

                {timeSlots.map((slot, rowIndex) => (
                    <>
                        <div
                            className="schedule-cell schedule-hour"
                            key={`hour-${slot.start}`}
                            style={{ gridRow: rowIndex + 2 }}
                        >
                            {slot.start}:00 - {slot.end}:00
                        </div>

                        {days.map((day, dayIndex) => (
                            <div
                                className="schedule-cell"
                                key={`${day}-${slot.start}`}
                                style={{
                                    gridColumn: dayIndex + 2, /*first row and column are for the hours and days option */
                                    gridRow: rowIndex + 2,
                                }}
                            />
                        ))}
                    </>
                ))}

                {lessons.map((lesson) => {
                    const startRow = boundaries.indexOf(lesson.startHour) + 2;
                    const endRow = boundaries.indexOf(lesson.startHour + lesson.duration) + 2;

                    return (
                        <Link
                            key={lesson.id}
                            to={`/lessons/${lesson.id}`}
                            className="lesson-card"
                            style={{
                                gridColumn: lesson.day + 2,
                                gridRow: `${startRow} / ${endRow}`,
                            }}
                        >
                            {lesson.title}
                        </Link>
                    );
                })}
            </div>
        </section>
    );
};

export default WeeklySchedule;