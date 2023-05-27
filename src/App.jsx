import "./App.css";
import Festival from "./Festival";
import { parse } from "./Parser";

// Markdown string
const schedule = `
# Thursday June 8, 2023

## Splendor
- 22:00-00:00 Asch Pintura
- 00:00-02:00 Romain Garcia
- 02:00-04:00 Jody Wisternoff b2b Simon Doty

## The Cove
- 21:00-23:00 Mia Aurora
- 23:00-01:00 Steven Weston (Live)
- 01:00-04:30 James Shinra

## Yacht Club
- 20:00-22:00 ixto
- 22:00-00:00 Bani D
- 00:00-03:00 VONDA7

# Friday June 9, 2023

## Empire
- 21:00-23:00 Laura T
- 23:00-01:00 Rezident
- 01:00-03:00 CRi (DJ Set)
- 03:00-06:00 Dusky

## Splendor
- 21:00-00:30 MOLØ
- 00:30-05:30 James Grant

## The Cove
- 12:00-15:00 Dom Donnelly
- 15:00-18:00 Hosini
- 18:00-21:00 Cornelius SA
- 21:00-23:00 Warung
- 23:00-01:00 Braxton
- 01:00-03:00 Michael Cassette

## Yacht Club
- 19:00-21:00 M.O.S
- 21:00-00:00 Nordfold
- 00:00-03:00 PROFF

## Gjipe
- 12:00-15:00 Igor Garanin
- 15:00-18:30 CRi b2b Yotto

## Poolside Sessions
Havana Beach Club
- 15:00-16:30 Romain Garcia
- 16:30-18:00 Dusky
- 18:00-19:30 HANA

## Wellness
Havana Beach Club
- 10:00-11:00 Beyond Belief Breathwork
- 11:00-12:00 Afterglow Yoga
- 12:00-13:00 Hot Minute HiiT
- 17:00-18:00 Cowboy Capoeira
- 18:00-19:00 Sun Kissed Yoga + DJ
...
`;

function App() {
  const festival = parse("Explorations 2023", schedule);
  return <Festival festival={festival} />;
}

export default App;
