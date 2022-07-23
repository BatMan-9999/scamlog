import { CheckCircle } from "react-feather";

export default function PartneredBadge() {
  return (
    <span className="align-middle badge badge-sm bg-emerald-500 text-base-100 py-2">
      <CheckCircle className="align-middle" height={15} width={15} />
      <span className="ml-1 align-middle">Partnered</span>
    </span>
  );
}
