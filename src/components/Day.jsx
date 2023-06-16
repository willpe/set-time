import { useContext } from "react";
import { Link } from "react-router-dom";
import { TimeContext } from "../contexts/TimeContext";

import Set from "./Set";

function TimeScale({ start, end }) {
  let hour = start.getHours();
  let duration = Math.floor((end - start) / 1000 / 60 / 60);

  const content = [];
  for (let i = 0; i <= duration; i++) {
    const rowStart = 4 * (i + 1);
    content.push(
      <div key={rowStart} style={{ gridRowStart: rowStart }}>
        {hour < 10 ? "0" : null}
        {hour}:00
      </div>
    );

    hour = (hour + 1) % 24;
  }

  // Fill out the grid for the last hour
  content.push(<div key="final" style={{ gridRowStart: 4 * (duration + 2) - 1 }} />);

  return (
    <div
      className="times"
      data-range={`from ${start.getHours()} to ${(start.getHours() + duration) % 24} (${duration} hrs)`}
    >
      {content}
    </div>
  );
}

function GridLines({ start, end }) {
  let hour = start.getHours();
  let duration = Math.floor((end - start) / 1000 / 60 / 60);

  const content = [];
  for (let i = 0; i < duration + 2; i++) {
    const rowStart = 4 * i + 1;
    content.push(<div data-hour={hour + i} key={rowStart} style={{ gridRowStart: rowStart }}></div>);

    hour = (hour + 1) % 24;
  }

  return (
    <div
      className="gridlines"
      data-range={`from ${start.getHours()} to ${(start.getHours() + duration) % 24} (${duration} hrs)`}
    >
      {content}
    </div>
  );
}

// Compute where to show the current time indicator
function calculateCurrentTimeLinePosition(currentTime, startTime, endTime) {
  // Compute the time the grid ebd,
  // adjusting for the footer to the next whole hour
  const end = new Date(endTime);
  end.setMinutes(0);
  end.setHours(end.getHours() + 1);

  // Compute the offset from the start of the grid
  const now = currentTime - startTime;

  // Compute the length of the grid
  const duration = end - startTime;

  // Calculate the current percentage through the day
  return Math.round((100 * now) / duration);
}

export default function Day({ day }) {
  const { time, isHappeningNow } = useContext(TimeContext);
  const isNow = isHappeningNow(day.opens, day.closes);
  const currentTimeOffset = isNow ? calculateCurrentTimeLinePosition(time, day.opens, day.closes) : null;

  return (
    <section className="day" key={day.id} data-id={day.id}>
      <div className="day-header">
        <h2>{day.name}</h2>
        {isNow ? (
          <Link to="../now" className="button">
            Today
          </Link>
        ) : (
          <small>{day.dateShort}</small>
        )}
      </div>
      <div className="timeline">
        <TimeScale start={day.opens} end={day.closes} />

        <div className="grid">
          <div className="stages">
            {day.stages.map((stage) => (
              <div key={stage.id} className="stage" data-id={stage.id}>
                <GridLines start={day.opens} end={day.closes} />
                <h3>{stage.name}</h3>
                {stage.sets.map((set) => (
                  <Set key={set.id} set={set} stage={stage} day={day} />
                ))}
                {isNow ? <div className="current-time" style={{ height: `${currentTimeOffset}%` }}></div> : null}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
