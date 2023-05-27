import "./App.css";
import { parse } from "./Parser";

// Markdown string
const schedule = `
# Thursday June 8, 2023

## Splendor
- 22:00-00:00 Asch Pintura
- 00:00-02:00 Romain Garcia
- 02:00-04:00 Jody Wisternoff b2b Simon Doty

## The Cove
- 21:00-23:00 Mia Aurora
- 23:00-01:00 Steven Weston (Live)
- 01:00-04:30 James Shinra

## Yacht Club
- 20:00-22:00 ixto
- 22:00-00:00 Bani D
- 00:00-03:00 VONDA7

# Friday June 9, 2023

## Empire
- 21:00-23:00 Laura T
- 23:00-01:00 Rezident
- 01:00-03:00 CRi (DJ Set)
- 03:00-06:00 Dusky

## Splendor
- 21:00-00:30 MOLØ
- 00:30-05:30 James Grant

## The Cove
- 12:00-15:00 Dom Donnelly
- 15:00-18:00 Hosini
- 18:00-21:00 Cornelius SA
- 21:00-23:00 Warung
- 23:00-01:00 Braxton
- 01:00-03:00 Michael Cassette

## Yacht Club
- 19:00-21:00 M.O.S
- 21:00-00:00 Nordfold
- 00:00-03:00 PROFF

## Gjipe
- 12:00-15:00 Igor Garanin
- 15:00-18:30 CRi b2b Yotto

## Poolside Sessions
Havana Beach Club
- 15:00-16:30 Romain Garcia
- 16:30-18:00 Dusky
- 18:00-19:30 HANA

## Wellness
Havana Beach Club
- 10:00-11:00 Beyond Belief Breathwork
- 11:00-12:00 Afterglow Yoga
- 12:00-13:00 Hot Minute HiiT
- 17:00-18:00 Cowboy Capoeira
- 18:00-19:00 Sun Kissed Yoga + DJ
...
`;

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

  return (
    <div
      key={start}
      id={set.id}
      className={`set ${set.adjacent ? "adjacent" : ""}`}
      style={{ gridRow: `${5 + start * 4} / span ${duration * 4}` }}
      onClick={() => console.log(`${day.id}/${stage.id}/${set.id}`)}
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
      <p>
        Opens: {day.opens.toLocaleString()}, Closes:{" "}
        {day.closes.toLocaleString()}
      </p>

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
  return (
    <>
      <h1 data-id={festival.id}>Explorations 2023</h1>
      {festival.days.map((day) => (
        <Day key={day.id} day={day} />
      ))}
    </>
  );
}

export default Festival;
