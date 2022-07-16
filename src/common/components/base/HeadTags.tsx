export default function HeadTags() {
  return (
    <>
      <title>Scam Log</title>

      {/* Meta tags for embed */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta
        name="twitter:title"
        content="Scam Log - A community-driven database of known scam servers"
      />
      <meta
        name="twitter:description"
        // lol github copilot
        content="Scam Log is a community-driven database of known Discord scam servers. It is a free service that anyone can use to keep track of known scam servers, and report discovered ones."
      />
      <meta name="twitter:image" content="/static/card/shields.png" />

      <meta name="theme-color" content="#4758e8" />

      {/* Open Graph */}

      <meta
        property="og:title"
        content="Scam Log - A community-driven database of known scam servers"
      />
      <meta property="og:site_name" content="Scam Log" />
      <meta property="og:url" content="https://scamlog.compositr.dev" />
      <meta
        property="og:description"
        content="Scam Log is a community-driven database of known Discord scam servers. It is a free service that anyone can use to keep track of known scam servers, and report discovered ones."
      />
      <meta property="og:type" content="website" />
      <meta property="og:image" content="/static/img/favicon.png" />

      {/* Other */}

      <meta property="theme-color" content="#4758e8" />
    </>
  );
}
