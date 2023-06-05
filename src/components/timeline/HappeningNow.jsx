import { useContext } from "react";
import { FestivalContext } from "../../contexts/FestivalContext";
import { TimeContext } from "../../contexts/TimeContext";

import Performance from "./Performance";

export default function HappeningNow() {
  const { festival } = useContext(FestivalContext);
  const { time } = useContext(TimeContext);

  function isWithin(start, end) {
    return time >= start && time <= end;
  }

  const today = festival.schedule.days.find((day) => isWithin(day.opens, day.closes));
  const now = [];
  today.stages.forEach((stage) => {
    stage.sets.forEach((set) => {
      if (isWithin(set.startTime, set.endTime)) {
        const remainingMinutes = (set.endTime - time) / 1000 / 60;
        now.push({ stage, set, remainingMinutes });
      }
    });
  });

  console.log(now);
  return (
    <section className="now">
      <h2>
        {today.name} {time.toLocaleTimeString()}
      </h2>

      {now.map(({ stage, set, remainingMinutes }) => (
        <div className="card" key={`${stage.id}/${set.id}`}>
          <h3>{stage.name}</h3>
          <Performance performance={set.performance} />
          <small>
            {set.startTime.toLocaleTimeString()} - {set.endTime.toLocaleTimeString()}
            {remainingMinutes < 15 ? <span className="ending-soon"> (ending soon)</span> : null}
          </small>
        </div>
      ))}
    </section>
  );
}
