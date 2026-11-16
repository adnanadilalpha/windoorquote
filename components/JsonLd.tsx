export default function JsonLd({
  data,
}: {
  data:
    | Record<string, unknown>
    | null
    | Array<Record<string, unknown> | null | undefined>;
}) {
  const payload = Array.isArray(data)
    ? data.filter((item): item is Record<string, unknown> => item != null)
    : data;
  if (!payload || (Array.isArray(payload) && payload.length === 0)) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
    />
  );
}
