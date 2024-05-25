export default function Performance({ performance }) {
  return (
    <>
      {performance.artist}
      {performance.b2b ? performance.b2b.map((b2b, index) => 
        <span key={index}>

          <span className="b2b"> b2b </span>
          {b2b}
        </span>
      ) : null}
      {performance.notes ? <span className="notes">({performance.notes})</span> : null}
    </>
  );
}
