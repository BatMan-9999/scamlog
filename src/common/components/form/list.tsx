import { X } from "react-feather";

export default function List<T extends string | number>({
  setter,
  value,
}: {
  setter: Function;
  value: T[];
}) {
  return (
    <div className="mt-4 flex flex-col gap-2 md:gap-4 w-full">
      {value.map((item, index) => (
        <div key={index} className="p-2 border relative">
          <div
            className="absolute -top-2 -right-2 bg-error hover:bg-red-500 rounded-full"
            onClick={() => {
              setter(value.filter((i) => i !== item));
            }}
          >
            <X />
          </div>
          <span>{item}</span>
        </div>
      ))}
    </div>
  );
}
