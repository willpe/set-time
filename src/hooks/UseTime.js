import { useEffect, useMemo, useState } from "react";

export default function useTime(options) {
  const [time, setTime] = useState(options.start ? new Date(options.start) : new Date());

  const shortTimeStyle = { hourCycle: "h23", timeStyle: "short" };

  useEffect(() => {
    const velocity = options.velocity || 1;
    const interval = options.interval || 15000;
    let updateTime = 0;

    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        console.info(`Became visible, starting clock`);
        updateTime = setInterval(() => {
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
      } else {
        console.info(`Became hidden, stopping clock`);
        clearInterval(updateTime);
        updateTime = 0;
      }
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    onVisibilityChange();

    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      clearInterval(updateTime);
      updateTime = 0;
    };
  }, []);

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
