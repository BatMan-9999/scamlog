import { Settings } from "react-feather";

export default function RootBadge() {
  return (
    <span className="badge badge-accent py-4">
      <Settings className="align-middle" />
      <span className="ml-1 align-middle">Root</span>
    </span>
  );
}
