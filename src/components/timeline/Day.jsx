import styles from "./Day.module.css";

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
  content.push(
    <div key="final" style={{ gridRowStart: 4 * (duration + 2) - 1 }} />
  );

  return (
    <div
      className={styles.times}
      data-range={`from ${start.getHours()} to ${
        (start.getHours() + duration) % 24
      } (${duration} hrs)`}
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
    content.push(
      <div
        data-hour={hour + i}
        key={rowStart}
        style={{ gridRowStart: rowStart }}
      ></div>
    );

    hour = (hour + 1) % 24;
  }

  return (
    <div
      className={styles.gridlines}
      data-range={`from ${start.getHours()} to ${
        (start.getHours() + duration) % 24
      } (${duration} hrs)`}
    >
      {content}
    </div>
  );
}

export default function Day({ day }) {
  return (
    <section key={day.id} data-id={day.id}>
      <h2>{day.name}</h2>
      <div className={styles.timeline}>
        <TimeScale start={day.opens} end={day.closes} />

        <div className={styles.stgs}>
          <GridLines start={day.opens} end={day.closes} />

          <div className={styles.stgwrp}>
            <div className={styles.stg}>
              <div className={styles.st}></div>
            </div>
            <div className={styles.stg}>
              <div className={styles.st}></div>
            </div>
            <div className={styles.stg}>
              <div className={styles.st}></div>
            </div>
            <div className={styles.stg}>
              <div className={styles.st}></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
