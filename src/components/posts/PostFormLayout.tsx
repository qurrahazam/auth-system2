export default function PostFormLayout({
  left,
  right,
}: {
  left: React.ReactNode;
  right: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
      <div>{left}</div>
      <div>{right}</div>
    </div>
  );
}
