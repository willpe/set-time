import './App.css'

// Regular expression patterns
const dayPattern = /^#\s+(.*)/;
const stagePatten = /^##\s+(.*)/;
const setPattern = /^- (\d{2}:\d{2})-(\d{2}:\d{2}) (.*)$/;

// parse the day, stage and sets from the markdown string
const parse = (schedule) => {
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

export default function Parser() {
    return { parse };
}
