import classNames from "classnames";

interface SidebarProps {
  title: string;
  displayShadow?: boolean;
  items: {
    year: number;
    month: number;
  }[];
}
export const Sidebar = ({
  title,
  items,
  displayShadow = false,
}: SidebarProps) => {
  return (
    <div
      className={classNames("h-screen w-2/12 border-r bg-white", {
        "border-silver": displayShadow,
      })}
    >
      <div className="p-4 relative h-full">
        <h2 className="text-lg uppercase tracking-tight font-semibold text-rose-900 mb-4 uppercase">
          {title}
        </h2>
        <ul className="space-y-4">
          {items.map((item, index) => (
            <li
              key={index}
              className="text-sm uppercase tracking-tight font-semibold text-rose-600 cursor-pointer hover:text-rose-900"
            >
              {new Date(item.year, item.month - 1).toLocaleString("default", {
                month: "short",
              })}{" "}
              {item.year}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
