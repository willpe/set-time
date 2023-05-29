import { useState } from "react";
import { useLoaderData } from "react-router";

import { parse } from "../Parser";
import { Outlet } from "react-router-dom";

import { FestivalContext } from "../contexts/FestivalContext";

import Schedule from "../components/timeline/Schedule";

export async function loader({ params }) {
  const result = await fetch(`/schedules/${params.festivalId}/festival.json`);
  if (!result) {
    throw new Response("", {
      status: 404,
      statusText: "Not Found",
    });
  }

  const festival = await result.json();
  return { festival };
}

export default function Festival() {
  const { festival } = useLoaderData();
  const storedFavorites =
    localStorage.getItem(`favorites-${festival.id}`)?.split(",") || [];

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
      <>
        <section>
          <header>
            <h1 data-id={festival.id}>{festival.name}</h1>
            <aside>
              <p>{festival.location.name}</p>
              <p className="text-alt">
                {festival.startDate} - {festival.endDate}
              </p>
            </aside>
          </header>
        </section>
        <Outlet />
      </>
    </FestivalContext.Provider>
  );
}
