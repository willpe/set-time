export const shortTimeStyle = { hourCycle: "h23", timeStyle: "short" };

export class RowRange {
  constructor(start, end, span) {
    this.start = start;
    this.end = end;
    this.span = span;
  }
}

export default class TimeGrid {
  constructor(day) {
    this.day = day;

    this.startTime = new Date(day.opens);
    this.startTime.setMinutes(0);

    this.endTime = new Date(day.closes);
    this.endTime.setHours(this.endTime.getHours() + 1);
    this.endTime.setMinutes(0);

    this.minutes = (this.endTime - this.startTime) / 1000 / 60;

    this.headerRows = new RowRange(1, 1 + TimeGrid.headerRows, TimeGrid.headerRows);
    this.endRow = this.headerRows.end + Math.ceil(this.minutes / TimeGrid.minutesPerRow);
  }

  static headerRows = 12;
  static minutesPerRow = 5;

  // Compute where to show the current time indicator
  calculateTimeLinePosition(time) {
    const isNow = this.startTime < time && time < this.endTime;
    if (!isNow) {
      return null;
    }

    const headerMinutes = TimeGrid.headerRows * TimeGrid.minutesPerRow;
    const gridMinutes = this.minutes;
    const totalMinutes = headerMinutes + gridMinutes;

    const minutesThroughDay = (time - this.startTime) / 1000 / 60;
    const percentThroughGrid = minutesThroughDay / gridMinutes;

    const headerPercent = headerMinutes / totalMinutes;
    const gridPercent = gridMinutes / totalMinutes;

    const timelinePercent = gridPercent * percentThroughGrid;

    return {
      header: Math.round(100 * headerPercent),
      line: Math.round(100 * timelinePercent),
    };
  }

  calculateGridRowSpan(startTime, endTime) {
    const minutesSinceStart = (startTime - this.startTime) / 1000 / 60;
    const startRow = Math.floor(minutesSinceStart / TimeGrid.minutesPerRow) + 1 + TimeGrid.headerRows;

    const duration = (endTime - startTime) / 1000 / 60;
    const span = Math.ceil(duration / TimeGrid.minutesPerRow);
    const endRow = startRow + span;
    return [startRow, endRow, span];
  }

  forEachHour(callback) {
    const startHour = this.startTime.getHours();
    const duration = this.minutes / 60;
    for (var i = 0; i < duration; i++) {
      var gridTime = new Date(this.startTime);
      gridTime.setHours(startHour + i);

      var gridTimeEnd = new Date(gridTime);
      gridTimeEnd.setHours(gridTime.getHours() + 1);

      var [startRow, endRow] = this.calculateGridRowSpan(gridTime, gridTimeEnd);

      callback(startRow, gridTime, endRow, gridTimeEnd);
    }
  }
}
