import { Link } from "react-router";
import { BELT_NAMES, levels, getStripeCount } from "@/data";

const BeltPath = ({ activeId }: { activeId?: string }) => (
  <div className="belt-path">
    {levels.map((level, index) => {
      const stripeCount = getStripeCount(level);
      const stripeColor = level.stripe;
      return (
        <Link
          className={`belt-card ${activeId === level.id ? "active" : ""}`}
          key={level.id}
          to={`/kyu/${level.id}`}
        >
          <span className="belt-index">{String(index + 1).padStart(2, "0")}</span>
          <span className="belt-swatch" style={{ backgroundColor: level.color }}>
            {stripeCount > 0 && stripeColor && (
              <span className="belt-stripes">
                {Array.from({ length: stripeCount }, (_, i) => (
                  <i key={i} style={{ backgroundColor: stripeColor }} />
                ))}
              </span>
            )}
          </span>
          <strong>{BELT_NAMES[level.belt]}</strong>
          <span>{level.kyu}</span>
          <small>{level.level}</small>
        </Link>
      );
    })}
  </div>
);

export default BeltPath;
