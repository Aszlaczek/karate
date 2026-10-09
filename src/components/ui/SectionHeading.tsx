interface SectionHeadingProps {
  number?: string;
  title: string;
  subtitle: string;
}

export default function SectionHeading({ number, title, subtitle }: SectionHeadingProps) {
  return (
    <div className="section-heading">
      <div>
        {number && <span className="section-number">{number}</span>}
        <h2>{title}</h2>
      </div>
      <p>{subtitle}</p>
    </div>
  );
}