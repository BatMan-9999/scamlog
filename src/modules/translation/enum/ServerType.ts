enum ServerTypeTranslation {
  QR = "QR Code",
  FAKENITRO = "Fake Nitro",
  OAUTH = "Forced Join/OAuth",
  VIRUS = "Malware and Viruses",
  NSFW = "Not Safe for Work Scams",
  SPAM = "Mass DM/Ads or Spam Servers",
  LINKING = "Server which spam links to other servers",
  ROBLOX = "Roblox-related Scams",
  SELLING = "Servers selling illegal/TOS-breaking items",

  OTHER = "Other",
}

export const ObjectServerTypeTranslation = {
  QR: ServerTypeTranslation.QR,
  FAKENITRO: ServerTypeTranslation.FAKENITRO,
  OAUTH: ServerTypeTranslation.OAUTH,
  VIRUS: ServerTypeTranslation.VIRUS,
  NSFW: ServerTypeTranslation.NSFW,
  SPAM: ServerTypeTranslation.SPAM,
  LINKING: ServerTypeTranslation.LINKING,
  ROBLOX: ServerTypeTranslation.ROBLOX,
  SELLING: ServerTypeTranslation.SELLING,

  OTHER: ServerTypeTranslation.OTHER,
};

export default ServerTypeTranslation as any;
