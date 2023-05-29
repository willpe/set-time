import { useEffect, useState } from "react";
import { parse } from "./Parser";

import Festival from "./Festival";

import "./App.css";
import { Outlet } from "react-router";

export default function App() {
  const [festival, setFestival] = useState(null);
  useEffect(() => {
    const load = async () => {
      const result = await fetch("schedules/explorations-2023.md");
      const text = await result.text();

      let festival = parse("Explorations 2023", text);
      setFestival(festival);
    };

    load();
  }, []);

  if (!festival) {
    return <div>Loading...</div>;
  } else {
    return <Outlet />;
    // return <Festival festival={festival} />;
  }
}
