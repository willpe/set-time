import './App.css'

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

// Regular expression patterns
const dayPattern = /^#\s+(.*)/;
const stagePatten = /^##\s+(.*)/;
const setPattern = /^- (\d{2}:\d{2})-(\d{2}:\d{2}) (.*)$/;

// parse the day, stage and sets from the markdown string
const parseSchedule = (schedule) => {
  const lines = schedule.split('\n');
  const days = [];
  let day = null;
  let date = null;
  let stage = null;

  for (const line of lines) {
    console.log(line);

    const dayMatch = line.match(dayPattern);
    if (dayMatch) {
      date = new Date(dayMatch[1]);
      day = {
        name: dayMatch[1],
        date: date,
        stages: [],
      };

      console.log(day);
      days.push(day);
      continue;
    }

    const stageMatch = line.match(stagePatten);
    if (stageMatch) {
      if (stage !== null) {
        stage.opens = stage.sets[0].start;
        stage.closes = stage.sets[stage.sets.length - 1].end;
      }

      stage = {
        name: stageMatch[1],
        sets: [],
      };

      day.stages.push(stage);
      continue;
    }

    const setMatch = line.match(setPattern);
    if (setMatch) {

      // compute the number of hours between the start time and the end time
      const start = setMatch[1].split(':');
      const end = setMatch[2].split(':');
      let hours = parseInt(end[0]) - parseInt(start[0]);
      const minutes = parseInt(end[1]) - parseInt(start[1]);

      // handle sets that end after midnight (e.g. 23:00-01:00
      if (hours < 0) { 
        hours += 24; 
        let tomorrow = new Date(date);
        tomorrow.setDate(date.getDate() + 1);

        date = tomorrow;
      }

      const duration = hours + minutes / 60;
      const startTime = new Date(date);
      startTime.setHours(hours);
      startTime.setMinutes(minutes);

      const set = {
        start: setMatch[1],
        startTime: startTime,
        end: setMatch[2],
        performance: setMatch[3],
        duration: duration
      };
      stage.sets.push(set);
      continue;
    }
  }

  console.log(days);
  return days;
};


function Stage({ stage }) {
  // get the time the stage opens and closes
  const start = stage.sets[0].start;
  const end = stage.sets[stage.sets.length - 1].end;

  return (
    <><h2>{stage.name} ({stage.opens} - {stage.closes})</h2>
      <ul>
        {stage.sets.map(set => (
          <li>{set.start} - {set.end} <Performance performance={set.performance} /> ({set.duration} hrs) [{set.startTime.toLocaleString()}]</li>
        ))}
      </ul></>
  );
}

function Performance({ performance }) {
  let artist = performance;
  let notes = null;

  // if the performance ends with notes, like (Live), then extract them out
  const match = artist.match(/^(.*)\((.*)\)$/);
  if (match) {
    artist = match[1];
    notes = match[2];
  }

  // if the performance is b2b, like 'Jody Wisternoff b2b Simon Doty', then split out the artists
  const artists = artist.split(' b2b ');
  if (artists.length > 1) {
    return <> {artists[0]} <span className="b2b">b2b</span> {artists[1]} {notes ? (<span className="notes">({notes})</span>) : null}</>
  } else {
    return <>{artist} {notes ? (<span className="notes">({notes})</span>) : null}</>
  }
}

function Day({ day }) {
  return (
    <>
      <h1>{day.name}</h1>
      <p>{new Date(day.name).toDateString()}</p>
      {day.stages.map(stage => (
        <Stage stage={stage} />
      ))}
    </>
  );
}


function App() {
  const timetable = parseSchedule(schedule);

  const startOfDay = 10;
  const duration = 20;

  function TimeScale(start, length) {
    const content = [];
    let hour = start;
    for (let i = 0; i <= length; i++) {
      const rowStart = 4 * (i + 1);
      content.push(<div className="time" style={{ gridRowStart: rowStart }}>{hour}:00</div>);

      hour = (hour + 1) % 24;
    }

    return content;
  }

  function TimeRows(start, length) {
    const content = [];
    let hour = start;
    for (let i = 0; i < length + 2; i++) {
      const rowStart = 4 * (i) + 1;
      content.push(<div className="hour" style={{ gridRowStart: rowStart }}></div>);

      hour = (hour + 1) % 24;
    }

    return content;
  }

  return <>
    <div className="cal">

      <div className="times">
        {TimeScale(startOfDay, duration)}
      </div>
      <div className="stage">
        {TimeRows(startOfDay, duration)}

        <div class="set" style={{ gridRow: "3 / span 4" }}>Jimmy Dean</div>
        <div class="set adjacent" style={{ gridRow: "7 / span 6" }}>Paula Dean</div>
        <div class="set adjacent" style={{ gridRow: "13 / span 4" }}>Paula Poundstone</div>

        <div class="set" style={{ gridRow: "20 / span 4" }}>Jeff Goldblum</div>
      </div>

      <div className="stage">
        {TimeRows(startOfDay, duration)}

        <div class="set" style={{ gridRow: "5 / span 4" }}>Jimmy Dean</div>
        <div class="set adjacent" style={{ gridRow: "9 / span 6" }}>Paula Dean</div>
        <div class="set adjacent" style={{ gridRow: "15 / span 4" }}>Paula Poundstone</div>
        <div class="set adjacent" style={{ gridRow: "19 / span 4" }}>Jeff Goldblum</div>
      </div>
    </div>
    {timetable.map(day => (<Day day={day} />))}
  </>
}

export default App
