import { useContext, useMemo } from "react";
import { Link } from "react-router-dom";
import { TimeContext } from "../contexts/TimeContext";
import TimeGrid from "../TimeGrid";

import Set from "./Set";

const shortTimeStyle = { hourCycle: "h23", timeStyle: "short" };

export default function Day({ day }) {
  const { time, isHappeningNow } = useContext(TimeContext);
  const isNow = isHappeningNow(day.opens, day.closes);

  const timeGrid = useMemo(() => new TimeGrid(day, time), [day]);
  const currentTimePositions = useMemo(() => timeGrid.calculateTimeLinePosition(time), [timeGrid, time]);

  function GridLines() {
    const content = [];
    timeGrid.forEachHour((startRow, startTime) => {
      content.push(<div data-hour={startTime.getHours()} key={startRow} style={{ gridRowStart: startRow }}></div>);
    });

    return <div className="gridlines">{content}</div>;
  }

  function TimeScale() {
    const content = [];
    timeGrid.forEachHour((startRow, startTime) => {
      content.push(
        <div key={startRow} style={{ gridRowStart: startRow - 3 }}>
          {startTime.toLocaleTimeString("en-us", { hour: "numeric" })}
        </div>
      );
    });

    // Fill out the grid for the last hour
    content.push(<div key="final" style={{ gridRowStart: timeGrid.endRow + 4 }} />);

    return <div className="times">{content}</div>;
  }

  const singleStage = day.stages.length === 1;

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
              <div key={stage.id} className={`stage ${singleStage ? "single-stage" : ""}`} data-id={stage.id}>
                <GridLines start={day.opens} end={day.closes} />
                <h3>{stage.name}</h3>
                {stage.sets.map((set) => (
                  <Set key={set.id} timeGrid={timeGrid} set={set} stage={stage} day={day} />
                ))}
                {isNow ? (
                  <div
                    className="current-time"
                    style={{ top: `${currentTimePositions.header}%`, height: `${currentTimePositions.line}%` }}
                  >
                    <div className="current-time-line"></div>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
