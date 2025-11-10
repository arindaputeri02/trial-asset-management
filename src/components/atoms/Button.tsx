export default function Button({
  children,
  color = "blue",
  onClick,
  type = "button",
  className = "",
}: {
  children: React.ReactNode;
  color?: "blue" | "red" | "gray";
  onClick?: () => void;
  type?: "button" | "submit";
  className?: string;
}) {
  const colors = {
    blue: "bg-blue-600 hover:bg-blue-700 text-white",
    red: "bg-red-600 hover:bg-red-700 text-white",
    gray: "bg-gray-200 hover:bg-gray-300 text-black",
  };
  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-4 py-2 rounded transition ${colors[color]} ${className}`}
    >
      {children}
    </button>
  );
}
