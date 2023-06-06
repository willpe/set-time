export default function Performance({ performance }) {
  return (
    <>
      {performance.artist}
      {performance.b2b ? (
        <>
          <span className="b2b"> b2b </span>
          {performance.b2b}
        </>
      ) : null}
      {performance.notes ? <span className="notes">({performance.notes})</span> : null}
    </>
  );
}
