import { Link, useLoaderData } from "react-router-dom";

export async function loader() {
  return {
    festivals: [
      {
        name: "Explorations 2025",
        id: "explorations-2025",
        startDate: "June 12, 2025",
        endDate: "June 17, 2025",
        location: {
          name: "Dhermi, Albania",
        },
      },
      {
        name: "Dreamstate SoCal 2024",
        id: "dreamstate-socal-2024",
        startDate: "November 22, 2024",
        endDate: "November 23, 2024",
        location: {
          name: "Long Beach, CA",
        },
      },{
        name: "Explorations 2024",
        id: "explorations-2024",
        startDate: "June 13, 2024",
        endDate: "July 18, 2024",
        location: {
          name: "Dhermi, Albania",
        },
      },
      {
        name: "Group Therapy Weekender",
        id: "gtw-2023",
        startDate: "July 21, 2023",
        endDate: "July 23, 2023",
        location: {
          name: "The Gorge Amphitheatre",
        },
      },
      {
        name: "Anjunadeep Open Air",
        id: "openair-nyc-2023",
        startDate: "July 7, 2023",
        endDate: "June 7, 2023",
        location: {
          name: "New York City",
        }
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
        name: "Electric Forest 2023",
        id: "electric-forest-2023",
        startDate: "June 22, 2023",
        endDate: "June 25, 2023",
        location: {
          name: "Rothbury, MI",
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
