import { createContext, useContext, useState } from "react";
import "./App.css";

const FestivalContext = createContext(null);

function Stage({ stage, day }) {
  return (
    <div key={stage.id} className="stage" data-id={stage.id}>
      <TimeRows start={day.opens} end={day.closes} />
      <h3>{stage.name}</h3>
      {stage.sets.map((set) => (
        <Set key={set.id} set={set} stage={stage} day={day} />
      ))}
    </div>
  );
}

function Set({ set, stage, day }) {
  let duration = (set.endTime - set.startTime) / 1000 / 60 / 60;
  let start = (set.startTime - day.opens) / 1000 / 60 / 60;

  const festivalContext = useContext(FestivalContext);
  const isFavorite = festivalContext.isFavorite(day.id, stage.id, set.id);

  return (
    <div
      key={start}
      id={set.id}
      className={`set ${set.adjacent ? "adjacent" : ""} ${
        isFavorite ? "favorite" : ""
      }`}
      style={{ gridRow: `${5 + start * 4} / span ${duration * 4}` }}
      onClick={() => festivalContext.setFavorite(day.id, stage.id, set.id)}
    >
      <p>{Performance(set.performance)}</p>
    </div>
  );
}

function Performance(performance) {
  return (
    <>
      {performance.artist}
      {performance.b2b ? (
        <>
          <span className="b2b"> b2b </span>
          {performance.b2b}
        </>
      ) : null}
      {performance.notes ? (
        <span className="notes">({performance.notes})</span>
      ) : null}
    </>
  );
}

function TimeScale(start, end) {
  let hour = start.getHours();
  let duration = (end - start) / 1000 / 60 / 60;

  const content = [];
  for (let i = 0; i <= duration; i++) {
    const rowStart = 4 * (i + 1);
    content.push(
      <div key={rowStart} className="time" style={{ gridRowStart: rowStart }}>
        {hour < 10 ? "0" : null}
        {hour}:00
      </div>
    );

    hour = (hour + 1) % 24;
  }

  return content;
}

function TimeRows({ start, end }) {
  let hour = start.getHours();
  let duration = (end - start) / 1000 / 60 / 60;

  const content = [];
  for (let i = 0; i < duration + 2; i++) {
    const rowStart = 4 * i + 1;
    content.push(
      <div
        key={rowStart}
        className="hour"
        style={{ gridRowStart: rowStart }}
      ></div>
    );

    hour = (hour + 1) % 24;
  }

  return content;
}

function Day({ day }) {
  return (
    <section key={day.id} data-id={day.id}>
      <h2>{day.name}</h2>
      <div className="cal">
        <div className="times">{TimeScale(day.opens, day.closes)}</div>
        {day.stages.map((stage) => (
          <Stage stage={stage} day={day} key={stage.id} />
        ))}
      </div>
    </section>
  );
}

function Festival({ festival }) {
  const [favorites, setFavorites] = useState([]);
  function toggleFavorite(key) {
    setFavorites((f) => {
      const index = f.indexOf(key);
      if (index === -1) {
        return [...f, key];
      } else {
        return f.slice(0, index).concat(f.slice(index + 1));
      }
    });
  }

  const context = {
    festival: festival,
    setFavorite: (day, stage, set) => {
      const key = `${day}/${stage}/${set}`;
      toggleFavorite(key);
    },
    isFavorite: (day, stage, set) => {
      const key = `${day}/${stage}/${set}`;
      const isFavorite = favorites.indexOf(key) !== -1;
      return isFavorite;
    },
  };
  return (
    <FestivalContext.Provider value={context}>
      <h1 data-id={festival.id}>Explorations 2023</h1>
      {festival.days.map((day) => (
        <Day key={day.id} day={day} />
      ))}
    </FestivalContext.Provider>
  );
}

export default Festival;
