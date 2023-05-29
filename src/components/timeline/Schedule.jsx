import Day from "./Day";

export default function Schedule({ festival }) {
  return festival.days.map((day) => <Day key={day.id} day={day} />);
}
