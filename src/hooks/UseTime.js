import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";

export const shortTimeStyle = { hourCycle: "h23", timeStyle: "short" };

export function scrollCurrentTimeIntoView() {
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
}

export default function useTime(options) {
  const [time, setTime] = useState(options.start ? new Date(options.start) : new Date());
  const velocity = options.velocity || 1;
  const interval = (options.interval || 15) * 1000;

  var clockEnabled = true;
  var lastClockTick = 0;

  function throttledClockUpdate() {
    if (!clockEnabled) {
      return;
    }

    const now = new Date();
    const delta = now - lastClockTick;
    if (delta > interval) {
      lastClockTick = now;

      setTime((t) => {
        var newTime = new Date();
        if (!!options.start) {
          newTime = new Date(t);
          newTime.setMilliseconds(t.getMilliseconds() + interval * velocity);
        }

        // Avoid rapidly updates to state
        newTime.setMilliseconds(0);
        console.log(`Tick: ${newTime.toLocaleTimeString([], shortTimeStyle)}`);

        return newTime;
      });

      setTimeout(throttledClockUpdate, interval);
    }
  }

  useEffect(() => {
    // Set the clock on mount
    throttledClockUpdate();

    // Start/stop the clock on visibility change
    function onVisibilityChange() {
      if (document.visibilityState === "visible") {
        console.info(`Became visible, starting clock`);
        clockEnabled = true;
        throttledClockUpdate();
      } else {
        console.info(`Became hidden, stopping clock`);
        clockEnabled = false;
      }
    }

    var tick = false;
    function onScroll() {
      if (!tick) {
        throttledClockUpdate();

        setTimeout(() => {
          tick = false;
        }, 1000);
      }

      tick = true;
    }

    document.addEventListener("visibilitychange", onVisibilityChange);
    document.addEventListener("scroll", onScroll);

    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      document.removeEventListener("scroll", onScroll);
    };
  }, []);

  // On navigate, scroll current time into view
  const { pathname } = useLocation();
  useEffect(() => {
    setTimeout(scrollCurrentTimeIntoView, 200);
  }, [pathname]);

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
