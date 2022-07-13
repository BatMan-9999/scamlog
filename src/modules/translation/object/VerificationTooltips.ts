import { GuildVerificationLevel } from "discord-api-types/v10";

const verificationTooltips: Record<GuildVerificationLevel, string> = {
  "0": "Unrestricted",
  "1": "Members must have a verified email on their Discord account.",
  "2": "Members must be registered on Discord for longer than 5 minutes.",
  "3": "Members must be a member of the server for longer than 10 minutes.",
  "4": "Members must have a verified phone on their Discord account.",
};

export default verificationTooltips