import { useContext } from "react";
import { FestivalContext } from "../contexts/FestivalContext";
import { TimeContext } from "../contexts/TimeContext";
import Performance from "./Performance";
import { Link } from "react-router-dom";

export default function StarredSets() {
  const { festival, isFavorite, setFavorite } = useContext(FestivalContext);

  const timeContext = useContext(TimeContext);

  const favorites = [];
  festival.schedule.days.forEach((day) => {
    day.stages.forEach((stage) => {
      stage.sets.forEach((set) => {
        if (isFavorite(day.id, stage.id, set.id)) {
          favorites.push({ day, stage, set });
        }
      });
    });
  });

  function starredSet(day, stage, set) {
    const isNow = timeContext.isHappeningNow(set.startTime, set.endTime);
    const remainingMinutes = isNow ? (set.endTime - timeContext.time) / 1000 / 60 : null;

    return (
      <div key={set.id} id={set.id} className={`starred-set-card ${isNow ? "starred-set-now" : ""}`}>
        <div className="set-performance">
          <Performance performance={set.performance} />
        </div>
        <div className="set-stage">{stage.name}</div>
        <div className="set-times">
          {set.start} - {set.end}
          {isNow && remainingMinutes < 15 ? <span className="ending-soon"> (ending soon)</span> : null}
        </div>
      </div>
    );
  }

  function favoritesForDay(day) {
    const favorites = [];
    day.stages.forEach((stage) => {
      stage.sets.forEach((set) => {
        if (isFavorite(day.id, stage.id, set.id)) {
          favorites.push({ day, stage, set });
        }
      });
    });

    favorites.sort((a, b) => {
      return a.set.startTime - b.set.startTime;
    });

    return (
      <section key={day.name} className="day">
        <header>
          <h2>
            {day.name} <span className="muted">{day.dateShort}</span>
          </h2>
        </header>
        {favorites.length === 0 ? (
          <div className="nothing-here">
            <small className="muted">You haven't saved any sets for {day.name} yet.</small>
          </div>
        ) : (
          favorites.map(({ day, stage, set }) => starredSet(day, stage, set))
        )}
      </section>
    );
  }

  return <section className="starred-sets">{festival.schedule.days.map((day) => favoritesForDay(day))}</section>;
}
