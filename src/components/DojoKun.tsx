import { dojoKun } from "../data";
import Icon from "./Icon";

const DojoKun = () => (
  <section className="dojo-section" id="dojo-kun">
    <div className="dojo-intro">
      <span className="section-number light">04</span>
      <p className="japanese-vertical">道場訓</p>
      <h2>Dojo-kun</h2>
      <p>Siedem zasad dojo</p>
      <blockquote>„Ostatecznym celem karate nie jest zwycięstwo lub porażka, lecz doskonalenie charakteru.”</blockquote>
      <small>— Masutatsu Ōyama</small>
    </div>
    <div className="dojo-list">
      {dojoKun.map((entry, index) => (
        <details key={entry.reading} open={index === 0}>
          <summary><span>{String(index + 1).padStart(2, "0")}</span><strong>{entry.reading.replace("Hitotsu, ", "")}</strong><Icon name="chevron" size={20} /></summary>
          <div><p className="dojo-japanese">{entry.japanese}</p><p>{entry.polish}</p></div>
        </details>
      ))}
    </div>
  </section>
);

export default DojoKun;
