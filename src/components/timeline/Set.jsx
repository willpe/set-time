import { useContext } from "react";
import { FestivalContext } from "../../contexts/FestivalContext";

import Performance from "./Performance";

export default function Set({ set, stage, day }) {
  let duration = (set.endTime - set.startTime) / 1000 / 60 / 60;
  let start = (set.startTime - day.opens) / 1000 / 60 / 60;

  const festivalContext = useContext(FestivalContext);
  const isFavorite = festivalContext.isFavorite(day.id, stage.id, set.id);

  return (
    <div
      key={start}
      id={set.id}
      className={`set ${set.adjacent ? "adjacent" : ""} ${isFavorite ? "favorite" : ""}`}
      style={{ gridRow: `${5 + start * 4} / span ${duration * 4}` }}
      onClick={() => festivalContext.setFavorite(day.id, stage.id, set.id)}
    >
      <Performance performance={set.performance} />
    </div>
  );
}
