type Props = {
  children: string;
  center?: boolean;
};

export default function SectionTitle({ children, center = false }: Props) {
  return (
    <div className={`section-title${center ? " center" : ""}`}>
      <h2>{children}</h2>
      <div className="section-rule" aria-hidden="true" />
    </div>
  );
}
