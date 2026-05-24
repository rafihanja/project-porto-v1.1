type NisabProgressProps = {
  progress: number;
};

export function NisabProgress({ progress }: NisabProgressProps) {
  return (
    <div className="progress-block" aria-label={`Progress nisab ${progress}%`}>
      <div className="progress-meta">
        <span>Progress menuju nisab</span>
        <strong>{progress}%</strong>
      </div>
      <div className="progress-track">
        <span style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}
