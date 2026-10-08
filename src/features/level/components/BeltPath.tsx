import { Link } from "react-router";
import { BELT_NAMES, levels } from "../data";

const BeltPath = ({ activeId }: { activeId?: string }) => (
  <div className="belt-path">
    {levels.map((level, index) => (
      <Link className={`belt-card ${activeId === level.id ? "active" : ""}`} key={level.id} to={`/kyu/${level.id}`}>
        <span className="belt-index">{String(index + 1).padStart(2, "0")}</span>
        <span className="belt-swatch" style={{ backgroundColor: level.color }}>
          {level.stripe && <i style={{ backgroundColor: level.stripe }} />}
        </span>
        <strong>{BELT_NAMES[level.belt]}</strong>
        <span>{level.kyu}</span>
        <small>{level.level}</small>
      </Link>
    ))}
  </div>
);

export default BeltPath;
