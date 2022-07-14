import { Settings } from "react-feather";

export default function RootBadge() {
  return (
    <span className="badge badge-sm badge-accent py-2">
      <Settings className="align-middle" height={15} width={15} />
      <span className="ml-1 align-middle">Root</span>
    </span>
  );
}
