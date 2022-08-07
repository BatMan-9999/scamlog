import { ObjectServerTypeTranslation } from "@/modules/translation/enum/ServerType";
import { ServerType } from "@prisma/client";

export default function TypeSelect(setter: Function, value: string) {
  const mapTranslation: [string, string][] = [];

  for (const key in ObjectServerTypeTranslation) {
    mapTranslation.push([key, (ObjectServerTypeTranslation as any)[key]]);
  }

  return (
    <select
      className="select select-bordered w-full max-w-xs"
      onChange={(e) => setter(e.target.value as ServerType)}
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
