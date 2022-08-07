import { ObjectServerTypeTranslation } from "@/modules/translation/enum/ServerType";

export default function TypeSelect({ setter, value }: TypeSelectProps) {
  const mapTranslation: [string, string][] = [];

  for (const key in ObjectServerTypeTranslation) {
    mapTranslation.push([key, (ObjectServerTypeTranslation as any)[key]]);
  }

  return (
    <select
      className="select select-bordered w-full max-w-xs"
      onChange={(e) => setter(e.target.value)}
      value={value}
    >
      <option disabled>Select a type</option>
      {mapTranslation.map(([key, value]) => (
        <option key={key} value={key}>
          {value}
        </option>
      ))}
    </select>
  );
}

export interface TypeSelectProps {
  setter: Function;
  value: string;
}
