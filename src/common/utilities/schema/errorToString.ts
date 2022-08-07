import { SafeParseError } from "zod";

export default function errorToString<T>(err: SafeParseError<T>) {
  return err.error.issues.map((i) => i.message).join(", ");
}
