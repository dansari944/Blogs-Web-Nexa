import Link from "next/link";

export default function Logo({
  className = "",
  light = false,
}: {
  className?: string;
  light?: boolean;
}) {
  return (
    <div className={`flex items-center gap-2 group ${className}`}>
      <div
        className={`relative flex items-center justify-center w-10 h-10 rounded-xl
        ${light ? "bg-white text-primary" : "bg-primary text-white"}
        shadow-md group-hover:scale-105 transition-transform duration-300`}
      >
        <span
          className={`font-heading font-extrabold text-2xl ${
            light ? "text-primary" : "text-white"
          }`}
        >
          C
        </span>

        <div
          className={`absolute -top-1 -right-1 w-3 h-3 rounded-full bg-secondary border-2
          ${light ? "border-primary" : "border-white"}`}
        />
      </div>

      <span
        className={`font-heading text-2xl font-extrabold tracking-tight ${
          light ? "text-white" : "text-gray-900"
        }`}
      >
        Chatter<span className="text-secondary">Buzz</span>
      </span>
    </div>
  );
}