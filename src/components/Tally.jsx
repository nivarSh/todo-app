import { WkdayCard } from "./WkdayCard";

export function Tally({ tallyTime }) {
  const formatTimeInHoursAndMinutes = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    return `${hours} hours and ${minutes} minutes`;
  };

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600); // Calculate total hours
    const minutes = Math.floor((totalSeconds % 3600) / 60); // Calculate remaining minutes
    const formattedHours = String(hours).padStart(1, "0");
    const formattedMinutes = String(minutes).padStart(1, "0");
    return `${formattedHours}h ${formattedMinutes}m`;
  };

  const sumDailyTallyTime = (tallyTime) => {
    // Iterate thru the object
    let totalTime = 0;
    for (let day in tallyTime) {
      totalTime += tallyTime[day];
    }
    return totalTime;
  };

// Calculate the current day
const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    ];
    const currentDay = daysOfWeek[new Date().getDay()];

  return (
    <>
      <h1 className="text-gradient">Deepwork Tally</h1>
      <div className="weekdayCards">
        {/* Map through tallyTime object to create cards */}
        {Object.keys(tallyTime).map((weekday) => (
          <WkdayCard
            key={weekday}
            day={weekday}
            time={formatTime(tallyTime[weekday])}
            isCurrentDay={weekday === currentDay} // Pass whether this is the current day
          />
        ))}
      </div>
      <h3>
        You have logged{" "}
        {formatTimeInHoursAndMinutes(sumDailyTallyTime(tallyTime))} this week.
      </h3>
    </>
  );
}
