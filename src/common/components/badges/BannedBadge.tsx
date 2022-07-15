import { Lock } from "react-feather";

export default function BannedBadge() {
  return (
    <span className="align-middle badge badge-sm badge-error py-2">
      <Lock className="align-middle" height={15} width={15} />
      <span className="ml-1 align-middle">Banned</span>
    </span>
  );
}
