import { Shield } from "react-feather";

export default function StaffBadge() {
  return (
    <span className="badge badge-primary py-4">
      <Shield className="align-middle" />
      <span className="ml-1 align-middle">Staff</span>
    </span>
  );
}
