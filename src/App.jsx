import './App.css'

// Markdown string
const schedule = `
# Thursday

## Splendor
- 22:00-00:00 Asch Pintura
- 00:00-02:00 Romain Garcia
- 02:00-04:00 Jody Wisternoff b2b Simon Doty

## The Cove
- 21:00-23:00 Mia Aurora
- 23:00-01:00 Steven Weston (Live)
- 01:00-04:30 James Shinra
- 04:30-06:00 Fake Set for Testing


## Yacht Club
- 20:00-22:00 ixto
- 22:00-00:00 Bani D
- 00:00-03:00 VONDA7
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
  let stage = null;

  for (const line of lines) {
    console.log(line);

    const dayMatch = line.match(dayPattern);
    if (dayMatch) {

      console.log("DAY");
      day = {
        name: dayMatch[1],
        stages: [],
      };

      console.log(day);
      days.push(day);
      continue;
    }

    const stageMatch = line.match(stagePatten);
    if (stageMatch) {
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
      if (hours < 0) { hours += 24; }

      const duration = hours + minutes / 60;

      const set = {
        start: setMatch[1],
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
  return (
    <><h2>{stage.name}</h2>
      <ul>
        {stage.sets.map(set => (
          <li>{set.start} - {set.end} <Performance performance={set.performance} /> ({set.duration} hrs)</li>
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
      {day.stages.map(stage => (
        <Stage stage={stage} />
      ))}
    </>
  );
}


function App() {
  const timetable = parseSchedule(schedule);

  return <>
    {
      timetable.map(day => (<Day day={day} />))}
  </>
}

export default App
