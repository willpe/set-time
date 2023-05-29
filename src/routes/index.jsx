import { Link, useLoaderData } from "react-router-dom";

export async function loader() {
  return {
    festivals: [{ name: "Explorations 2023", id: "explorations-2023" }],
  };
}

export default function Index() {
  const { festivals } = useLoaderData();

  return (
    <p id="zero-state">
      {festivals.map((festival) => (
        <Link to={`/festivals/${festival.id}`}>{festival.name}</Link>
      ))}
    </p>
  );
}
