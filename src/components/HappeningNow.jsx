import { useContext } from "react";
import { FestivalContext } from "../contexts/FestivalContext";
import { TimeContext } from "../contexts/TimeContext";
import TimeGrid from "../TimeGrid";

import Set from "./Set";

export default function HappeningNow() {
  const { festival } = useContext(FestivalContext);
  const { time, timeShort, isHappeningNow } = useContext(TimeContext);

  const today = festival.schedule.days.find((day) => isHappeningNow(day.opens, day.closes));
  if (!today)
    return (
      <div className="nothing-happening">
        <h2>It's pretty quiet right now.</h2>
        <div>
          <small className="muted">Come back when the festival starts to see what's going on at each stage.</small>
        </div>
      </div>
    );

  const timeGrid = useMemo(() => new TimeGrid(day), [day]);

  const now = [];
  const startingSoon = [];
  today.stages.forEach((stage) => {
    stage.sets.forEach((set) => {
      if (isHappeningNow(set.startTime, set.endTime)) {
        now.push({ stage, set });
      } else {
        const startsInMinutes = (set.startTime - time) / 1000 / 60;
        if (startsInMinutes > 0 && startsInMinutes < 15) {
          startingSoon.push({ stage, set });
        }
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
        <Set key={set.id} timeGrid={timeGrid} set={set} stage={stage} day={today} />
      ))}

      {startingSoon && startingSoon.length > 0 ? (
        <>
          <h3>Starting Soon</h3>
          {startingSoon.map(({ stage, set }) => (
            <Set key={set.id} set={set} stage={stage} day={today} />
          ))}
        </>
      ) : null}
    </section>
  );
}
