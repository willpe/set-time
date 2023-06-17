const shortTimeStyle = { hourCycle: "h23", timeStyle: "short" };
const shortDateStyle = { month: "long", day: "numeric" };

function parseDay(line) {
  const dayPattern = /^#\s+(.*)/;

  const dayMatch = line.match(dayPattern);
  if (dayMatch) {
    const date = new Date(dayMatch[1]);
    const dayName = date.toLocaleDateString(navigator.language, {
      weekday: "long",
    });

    return {
      id: date.toISOString().slice(0, 10),
      name: dayName,
      date: date,
      dateShort: date.toLocaleDateString(navigator.language, shortDateStyle),
      opens: null,
      closes: null,
      stages: [],
    };
  }

  return null;
}

function parseStage(line) {
  const stagePatten = /^##\s+(.*)/;

  const stageMatch = line.match(stagePatten);
  if (stageMatch) {
    // replace all non-alphanumeric characters with dashes
    const stageId = stageMatch[1].replace(/\W/g, "-").toLowerCase();

    return {
      id: stageId,
      name: stageMatch[1],
      opens: null,
      closes: null,
      sets: [],
    };
  }

  return null;
}

function parseTime(time, date) {
  const timePattern = /^(\d{2}):(\d{2})$/;

  const timeMatch = time.match(timePattern);
  if (timeMatch) {
    const hours = parseInt(timeMatch[1]);
    const minutes = parseInt(timeMatch[2]);

    const result = new Date(date);
    result.setHours(hours);
    result.setMinutes(minutes);

    return result;
  }

  return null;
}

function parsePerformance(value) {
  let artist = value;
  let notes = null;
  let b2b = null;

  // if the performance ends with notes, like (Live), then extract them out
  const match = value.match(/^(.*)\((.*)\)$/);
  if (match) {
    artist = match[1];
    notes = match[2];
  }

  // if the performance is b2b, like 'Jody Wisternoff b2b Simon Doty', then split out the artists
  const artists = value.split(" b2b ");
  if (artists.length > 1) {
    artist = artists[0];
    b2b = artists[1];
  }

  return {
    artist: artist,
    b2b: b2b,
    notes: notes,
  };
}

function parseSet(line, date, previousSet) {
  const setPattern = /^- (\d{2}:\d{2})-(\d{2}:\d{2}) (.*)$/;

  const setMatch = line.match(setPattern);
  if (setMatch) {
    const startTime = parseTime(setMatch[1], date);
    if (previousSet && startTime.getTime() < previousSet.startTime.getTime()) {
      startTime.setDate(startTime.getDate() + 1);
    }

    const endTime = parseTime(setMatch[2], date);

    if (endTime.getTime() < startTime.getTime()) {
      endTime.setDate(endTime.getDate() + 1);
    }

    // replace all non-alphanumeric characters with dashes
    const setId = setMatch[1].replace(/:/g, "") + "-" + setMatch[3].replace(/\W/g, "-").toLowerCase();

    const performance = parsePerformance(setMatch[3]);

    return {
      id: setId,
      startTime: startTime,
      start: startTime.toLocaleTimeString(navigator.language, shortTimeStyle),
      endTime: endTime,
      end: endTime.toLocaleTimeString(navigator.language, shortTimeStyle),
      duration: (endTime.getTime() - startTime.getTime()) / 1000 / 60 / 60,
      performance: performance,
      adjacent: !!(previousSet && previousSet.endTime.getTime() === startTime.getTime()),
    };
  }

  return null;
}

export const parse = (name, schedule) => {
  const lines = schedule.split("\n");
  const days = [];
  let day = null;
  let date = null;
  let stage = null;

  for (const line of lines) {
    const dayMatch = parseDay(line);
    if (dayMatch) {
      day = dayMatch;
      date = day.date;

      days.push(day);
      continue;
    }

    const stageMatch = parseStage(line);
    if (stageMatch) {
      stage = stageMatch;
      date = day.date;

      day.stages.push(stage);
      continue;
    }

    const setMatch = parseSet(line, date, stage?.sets[stage.sets.length - 1]);
    if (setMatch) {
      stage.sets.push(setMatch);

      date = setMatch.endTime;
      continue;
    }
  }

  const festival = {
    id: name.replace(/\W/g, "-").toLowerCase(),
    name: name,
    opens: null,
    closes: null,
    days: days,
  };

  for (const d of days) {
    let dayOpens = null;
    let dayCloses = null;

    for (const s of d.stages) {
      s.opens = s.sets[0].startTime;
      if (dayOpens === null || s.opens < dayOpens) {
        dayOpens = s.opens;
      }

      s.closes = s.sets[s.sets.length - 1].endTime;
      if (dayCloses === null || s.closes > dayCloses) {
        dayCloses = s.closes;
      }
    }

    d.opens = dayOpens;
    d.closes = dayCloses;
  }

  festival.opens = festival.days[0].opens;
  festival.closes = festival.days[festival.days.length - 1].closes;

  return festival;
};
