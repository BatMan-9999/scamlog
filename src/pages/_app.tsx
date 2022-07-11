import "../styles/globals.css";
import type { AppProps } from "next/app";

function ScamLog({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
    </>
  );
}

export default ScamLog;
