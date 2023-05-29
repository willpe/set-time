import { createContext, useContext, useState } from "react";
import "./festival.css";

import Day from "../components/timeline/Day";
import { parse } from "../Parser";
import { useLoaderData } from "react-router";

export const FestivalContext = createContext(null);

export async function loader({ params }) {
  const result = await fetch(`/schedules/${params.festivalId}.md`);
  if (!result) {
    throw new Response("", {
      status: 404,
      statusText: "Not Found",
    });
  }

  const text = await result.text();

  let festival = parse("Explorations 2023", text);
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
      <h1 data-id={festival.id}>Explorations 2023</h1>
      {festival.days.map((day) => (
        <Day key={day.id} day={day} />
      ))}
    </FestivalContext.Provider>
  );
}
