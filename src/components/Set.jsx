import { useContext } from "react";
import { FestivalContext } from "../contexts/FestivalContext";
import { TimeContext } from "../contexts/TimeContext";

import Performance from "./Performance";

export default function Set({ set, stage, day }) {
  let duration = (set.endTime - set.startTime) / 1000 / 60 / 60;
  let start = (set.startTime - day.opens) / 1000 / 60 / 60;

  const festivalContext = useContext(FestivalContext);
  const isFavorite = festivalContext.isFavorite(day.id, stage.id, set.id);

  const timeContext = useContext(TimeContext);
  const isNow = timeContext.isHappeningNow(set.startTime, set.endTime);
  const remainingMinutes = isNow ? (set.endTime - timeContext.time) / 1000 / 60 : null;

  return (
    <div
      id={set.id}
      className={`card set ${set.adjacent ? "adjacent" : ""} ${isFavorite ? "favorite" : ""}`}
      style={{ gridRow: `${5 + start * 4} / span ${duration * 4}` }}
      onClick={() => festivalContext.setFavorite(day.id, stage.id, set.id)}
    >
      <div className="set-stage">{stage.name}</div>
      <div className="set-performance">
        <Performance performance={set.performance} />
      </div>
      <div className="set-times">
        {set.start} - {set.end}
        {remainingMinutes < 15 ? <span className="ending-soon"> (ending soon)</span> : null}
      </div>
    </div>
  );
}
