import { useContext } from "react";
import { FestivalContext } from "../../contexts/FestivalContext";
import Day from "./Day";

export default function Schedule() {
  const { festival } = useContext(FestivalContext);
  if (festival.schedule?.days?.length > 0) {
    return festival.schedule.days.map((day) => <Day key={day.id} day={day} />);
  }

  return <div>No Schedule Available</div>;
}
