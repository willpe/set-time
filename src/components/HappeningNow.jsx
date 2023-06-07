import { useContext } from "react";
import { FestivalContext } from "../contexts/FestivalContext";
import { TimeContext } from "../contexts/TimeContext";

import Set from "./Set";
import { Link } from "react-router-dom";

export default function HappeningNow() {
  const { festival } = useContext(FestivalContext);
  const { time, timeShort, isHappeningNow } = useContext(TimeContext);

  const today = festival.schedule.days.find((day) => isHappeningNow(day.opens, day.closes));
  if (!today)
    return (
      <div className="nothing-happening">
        <h2>Nothing is happening right now.</h2>
        <div>
          <small className="muted">It's {time.toLocaleString()}</small>
        </div>

        <Link to="../" className="button">
          Full Schedule
        </Link>
      </div>
    );

  const now = [];
  today.stages.forEach((stage) => {
    stage.sets.forEach((set) => {
      if (isHappeningNow(set.startTime, set.endTime)) {
        const remainingMinutes = (set.endTime - time) / 1000 / 60;
        now.push({ stage, set, remainingMinutes });
      }
    });
  });

  return (
    <section className="now">
      <header>
        <h2>
          {today.name} <span className="muted">{today.dateShort}</span>
        </h2>
        <aside>{(time, timeShort)}</aside>
      </header>

      {now.map(({ stage, set }) => (
        <Set key={set.id} set={set} stage={stage} day={today} />
      ))}

      <footer>
        <Link to="../" className="button">
          Full Schedule
        </Link>
      </footer>
    </section>
  );
}
