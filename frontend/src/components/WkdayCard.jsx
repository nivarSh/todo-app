export function WkdayCard({ day, time, isCurrentDay }) {
  return (
    <div className={`card wkday-card ${isCurrentDay ? "highlight" : ""}`}>
      <p>{day}</p>
      <p>{time}</p>
    </div>
  );
}
