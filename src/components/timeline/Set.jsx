function Performance(performance) {
  return (
    <>
      {performance.artist}
      {performance.b2b ? (
        <>
          <span className="b2b"> b2b </span>
          {performance.b2b}
        </>
      ) : null}
      {performance.notes ? (
        <span className="notes">({performance.notes})</span>
      ) : null}
    </>
  );
}

function Set({ set, stage, day }) {
  let duration = (set.endTime - set.startTime) / 1000 / 60 / 60;
  let start = (set.startTime - day.opens) / 1000 / 60 / 60;

  const festivalContext = useContext(FestivalContext);
  const isFavorite = festivalContext.isFavorite(day.id, stage.id, set.id);

  return (
    <div
      key={start}
      id={set.id}
      className={`set ${set.adjacent ? "adjacent" : ""} ${
        isFavorite ? "favorite" : ""
      }`}
      style={{ gridRow: `${5 + start * 4} / span ${duration * 4}` }}
      onClick={() => festivalContext.setFavorite(day.id, stage.id, set.id)}
    >
      <p>{Performance(set.performance)}</p>
    </div>
  );
}
