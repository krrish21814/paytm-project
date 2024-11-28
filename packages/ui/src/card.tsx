export function Card({
  
  title,
  children
}: {
  title: string;
  children?: React.ReactNode;
}): JSX.Element {
  return (
    <div
    className="w-full p-4"
  >
    <h1 className="text-xl border-b pb-2 font-medium ">
      {title}
    </h1>
    <div>
      {children}
    </div>
  </div>
);
}