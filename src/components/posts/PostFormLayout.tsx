export default function PostFormLayout({
  left,
  right,
}: {
  left: React.ReactNode;
  right: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_1.6fr] gap-8 p-8">
      <div>{left}</div>
      <div>{right}</div>
    </div>
  );
}
