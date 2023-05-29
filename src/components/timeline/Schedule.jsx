import { useLoaderData } from "react-router-dom";
import { parse } from "../../Parser";

import Day from "./Day";

export async function loader({ params }) {
  const result = await fetch(`/schedules/${params.festivalId}/schedule.md`);
  if (!result) {
    throw new Response("", {
      status: 404,
      statusText: "Not Found",
    });
  }

  const text = await result.text();

  let festival = parse("Anjunadeep Explorations", text);
  return { festival };
}

export default function Schedule() {
  const { festival } = useLoaderData();
  return festival.days.map((day) => <Day key={day.id} day={day} />);
}
