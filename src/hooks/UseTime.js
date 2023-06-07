import { useEffect, useMemo, useState } from "react";

export default function useTime(options) {
  const [time, setTime] = useState(options.start ? new Date(options.start) : new Date());

  const shortTimeStyle = { hourCycle: "h23", timeStyle: "short" };

  useEffect(() => {
    const velocity = options.velocity || 1;
    const interval = options.interval || 15000;

    const updateTime = setInterval(() => {
      if (options.start !== undefined) {
        setTime((t) => {
          const newTime = new Date(t);
          newTime.setMilliseconds(t.getMilliseconds() + interval * velocity);
          return newTime;
        });
      } else {
        setTime(new Date());
      }
    }, interval);

    return () => {
      clearInterval(updateTime);
    };
  });

  const timeContext = useMemo(() => {
    return {
      time: time,
      timeShort: time.toLocaleTimeString([], shortTimeStyle),
      isHappeningNow: (start, end) => {
        return time >= start && time <= end;
      },
      options,
    };
  }, [time]);

  return timeContext;
}
