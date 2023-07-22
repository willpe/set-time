import { useState, useContext } from "react";
import { useLoaderData } from "react-router";

import { parse } from "../Parser";
import { Outlet, Navigate, NavLink } from "react-router-dom";

import { FestivalContext } from "../contexts/FestivalContext";
import { TimeContext } from "../contexts/TimeContext";

export async function loader({ params }) {
  const result = await fetch(`/schedules/${params.festivalId}/festival.json`);
  if (!result) {
    throw new Response("", {
      status: 404,
      statusText: "Not Found",
    });
  }

  const festival = await result.json();

  const scheduleResponse = await fetch(`/schedules/${params.festivalId}/schedule.md`);
  if (scheduleResponse) {
    const text = await scheduleResponse.text();
    let schedule = parse(festival.name, text);
    festival.schedule = schedule;
  }

  return { festival };
}

export function FestivalIndex() {
  // const { festival } = useLoaderData();
  // const { isHappeningNow } = useContext(TimeContext);

  // const today = festival.schedule.days.find((day) => isHappeningNow(day.opens, day.closes));
  // if (today) {
  //   return <Navigate to="./now" />;
  // }

  return <Navigate to="./schedule" />;
}

export default function Festival() {
  const { festival } = useLoaderData();
  const { isHappeningNow } = useContext(TimeContext);
  const isNow = !!festival.schedule.days.find((day) => isHappeningNow(day.opens, day.closes));

  const storedFavorites = localStorage.getItem(`favorites-${festival.id}`)?.split(",") || [];

  const [favorites, setFavorites] = useState(storedFavorites);
  function toggleFavorite(key) {
    setFavorites((f) => {
      const index = f.indexOf(key);
      let result = null;
      if (index === -1) {
        result = [...f, key];
      } else {
        result = f.slice(0, index).concat(f.slice(index + 1));
      }

      localStorage.setItem(`favorites-${festival.id}`, result.join(","));
      return result;
    });
  }

  const context = {
    festival: festival,
    setFavorite: (day, stage, set) => {
      const key = `${day}/${stage}/${set}`;
      toggleFavorite(key);
    },
    isFavorite: (day, stage, set) => {
      const key = `${day}/${stage}/${set}`;
      const isFavorite = favorites.indexOf(key) !== -1;
      return isFavorite;
    },
  };

  return (
    <FestivalContext.Provider value={context}>
      <main>
        <header>
          <h1 data-id={festival.id}>{festival.name}</h1>
          <nav>
            <NavLink to="./schedule">Schedule</NavLink>
            {isNow ? <NavLink to="./now">Now Playing</NavLink> : null}
            <NavLink to="./starred">Saved Sets</NavLink>
          </nav>
        </header>
        <Outlet />
      </main>
    </FestivalContext.Provider>
  );
}
