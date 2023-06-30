import { useMemo, useContext } from "react";
import { TimeContext } from "../contexts/TimeContext";

export default function useTimeGrid(day) {
  const { time, isHappeningNow } = useContext(TimeContext);

  const timeGrid = useMemo(() => {
    const shortTimeStringOptions = { hour: "numeric" };
    const isNow = isHappeningNow(day.opens, day.closes);

    const headerRows = 12;
    const minutesPerRow = 5;
    const gridStartTime = new Date(day.opens);
    gridStartTime.setMinutes(0);

    const gridEndTime = new Date(day.closes);
    gridEndTime.setHours(gridEndTime.getHours() + 1);
    gridEndTime.setMinutes(0);

    const gridDurationMins = (gridEndTime - gridStartTime) / 1000 / 60;
    const rows = gridDurationMins / minutesPerRow + headerRows;

    function calculateGridRowSpan(startTime, endTime) {
      const minutesSinceStart = (startTime - gridStartTime) / 1000 / 60;
      const startRow = Math.floor(minutesSinceStart / minutesPerRow) + 1 + headerRows;

      const minutesSinceEnd = (endTime - gridStartTime) / 1000 / 60;
      const endRow = Math.ceil(minutesSinceEnd / minutesPerRow) + 1 + headerRows;
      return [startRow, endRow, endRow - startRow];
    }

    // Compute where to show the current time indicator
    function getCurrentTimeLinePosition() {
      const isNow = isHappeningNow(day.opens, day.closes);
      if (!isNow) {
        return null;
      }

      // Calculate the duration of the day in minutes
      const durationMins = (day.closes - day.opens) / 1000 / 60;

      // Compute the offset from the start of the grid
      const now = time - gridStartTime;
      const ratio = now / (durationMins * 60 * 1000);
      const offset = 40;
      const adjustment = durationMins / (gridDurationMins + offset);

      // Calculate the current percentage through the day
      return Math.round(100 * adjustment * ratio);
    }

    function forEachHour(callback) {
      const startHour = gridStartTime.getHours();
      const duration = (gridEndTime - gridStartTime) / 1000 / 60 / 60;
      for (var i = 0; i < duration; i++) {
        var gridTime = new Date(gridStartTime);
        gridTime.setHours(startHour + i);

        var gridTimeEnd = new Date(gridTime);
        gridTimeEnd.setHours(gridTime.getHours() + 1);

        var [startRow, endRow] = calculateGridRowSpan(gridTime, gridTimeEnd);

        callback(startRow, gridTime, endRow, gridTimeEnd);
      }
    }

    return {
      day,
      isNow,
      startTime: gridStartTime,
      startTimeString: gridStartTime.toLocaleTimeString(["en-us"], shortTimeStringOptions),
      endTime: gridEndTime,
      endTimeString: gridEndTime.toLocaleTimeString(["en-us"], shortTimeStringOptions),
      rows,
      calculateGridRowSpan,
      getCurrentTimeLinePosition,
      forEachHour,
      toTimeString: (date) => date.toLocaleTimeString(["en-us"], shortTimeStringOptions),
    };
  }, [time, isHappeningNow, day]);

  return timeGrid;
}
