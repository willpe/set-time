import { Link, useLoaderData } from "react-router-dom";

export async function loader() {
  return {
    festivals: [
      {
        name: "Electric Forest 2023",
        id: "electric-forest-2023",
        startDate: "June 22, 2023",
        endDate: "June 25, 2023",
        location: {
          name: "Rothbury, MI",
        },
      },
      {
        name: "Mini Forest 2023",
        id: "mini-forest-2023",
        startDate: "July 1, 2023",
        endDate: "July 2, 2023",
        location: {
          name: "Washington",
        },
      },
      {
        name: "Explorations 2023",
        id: "explorations-2023",
        startDate: "June 6, 2023",
        endDate: "June 14, 2023",
        location: {
          name: "Dhermi, Albania",
        },
      },
    ],
  };
}

export default function Index() {
  const { festivals } = useLoaderData();

  return (
    <main className="list">
      <nav className="festival-list">
        {festivals.map((festival) => (
          <Link key={festival.id} to={`/${festival.id}`} className="festival-card">
            <h3>{festival.name}</h3>
            <p className="dates">
              {festival.startDate} - {festival.endDate}
            </p>
            <p className="location">{festival.location.name}</p>
          </Link>
        ))}
      </nav>
    </main>
  );
}
