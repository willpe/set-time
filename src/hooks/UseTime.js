import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";

export default function useTime(options) {
  const [time, setTime] = useState(options.start ? new Date(options.start) : new Date());

  const shortTimeStyle = { hourCycle: "h23", timeStyle: "short" };

  const { pathname } = useLocation();
  const scrollCurrentTimeIntoView = () => {
    const currentTimeLines = document.getElementsByClassName("current-time-line");
    if (currentTimeLines && currentTimeLines.length > 0) {
      currentTimeLines[0].scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
      return;
    }

    const starredSetNow = document.getElementsByClassName("starred-set-now");
    if (starredSetNow && starredSetNow.length > 0) {
      starredSetNow[0].scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
      return;
    }

    const nowSection = document.getElementsByClassName("now");
    if (nowSection && nowSection.length > 0) {
      nowSection[0].scrollIntoView({ behavior: "smooth", block: "start", inline: "center" });
      return;
    }
  };

  useEffect(scrollCurrentTimeIntoView, [pathname]);

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

        setTimeout(scrollCurrentTimeIntoView, 200);
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
