import { ServerType } from "@prisma/client";

export default function TypeSelect(setter: Function, value: string) {
  return (
    <select
      className="select select-bordered w-full max-w-xs"
      onChange={(e) => setter(e.target.value as ServerType)}
      value={value}
    >
      <option disabled>Select a type</option>
      <option value="QR">QR</option>
      <option value="FAKENITRO">Fake Nitro</option>
      <option value="OAUTH">OAuth/Forced Join</option>
      <option value="VIRUS">Malware &amp; Viruses</option>
      <option value="NSFW">Nudes &amp; NSFW Scams</option>
      <option value="SPAM">Mass DMs, Spam &amp; Ads</option>
      <option value="OTHER">Other...</option>
    </select>
  );
}
