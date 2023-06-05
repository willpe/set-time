import { Link, useLoaderData } from "react-router-dom";

export async function loader() {
  return {
    festivals: [{ name: "Explorations 2023", id: "explorations-2023" }],
  };
}

export default function Index() {
  const { festivals } = useLoaderData();

  return (
    <main className="list">
      <nav className="festival-list">
        {festivals.map((festival) => (
          <Link to={`/${festival.id}`}>{festival.name}</Link>
        ))}
      </nav>
    </main>
  );
}
