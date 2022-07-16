import { AlertTriangle } from "react-feather";

export default function NSFWBadge() {
  return (
    <span className="align-middle badge badge-sm badge-warning py-2 ml-2">
      <AlertTriangle className="align-middle"  height={15} width={15} />
      <span className="ml-1 align-middle">NSFW</span>
    </span>
  );
}
