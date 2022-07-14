import { Shield } from "react-feather";

export default function StaffBadge() {
  return (
    <span className="align-middle badge badge-sm badge-primary py-2">
      <Shield width={15} height={15} className="align-middle" />
      <span className="ml-1 align-middle">Staff</span>
    </span>
  );
}
