function Stage({ stage, day }) {
  return (
    <div key={stage.id} className="stage" data-id={stage.id}>
      <TimeRows start={day.opens} end={day.closes} />
      <h3>{stage.name}</h3>
      {stage.sets.map((set) => (
        <Set key={set.id} set={set} stage={stage} day={day} />
      ))}
    </div>
  );
}
