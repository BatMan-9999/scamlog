export default function guildSize(memberCount: number) {
  if (memberCount < 500) return "Tiny";
  else if (memberCount > 500 && memberCount < 1000) return "Small";
  else if (memberCount > 1000 && memberCount < 10000) return "Medium";
  else if (memberCount > 10000 && memberCount < 100000) return "Large";
  else if (memberCount > 100000) return "Ginormous";
  else return "Unknown";
}

export function guildSizeColor(size: ReturnType<typeof guildSize>) {
  switch (size) {
    case "Tiny":
      return "badge-success";
    case "Small":
      return "badge-info";
    case "Medium":
      return "badge-primary";
    case "Large":
      return "badge-warning";
    case "Ginormous":
      return "badge-outline badge-danger";
    default:
      return "badge-neutral";
  }
}
