import { AlertTriangle } from "react-feather";

export default function NSFWBadge() {
  return (
    <span className="badge badge-warning py-4">
      <AlertTriangle className="align-middle" />
      <span className="ml-1 align-middle">NSFW</span>
    </span>
  );
}
