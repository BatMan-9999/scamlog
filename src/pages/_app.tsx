import "../styles/globals.css";
import type { AppProps } from "next/app";
import NavBar from "@/common/components/nav/NavBar";
import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "react-query";
import Head from "next/head";
import HeadTags from "@/common/components/base/HeadTags";

const client = new QueryClient();

function ScamLog({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <>
      <Head>
        <HeadTags />
      </Head>
      <SessionProvider session={session}>
        <QueryClientProvider client={client}>
          <NavBar links={[]} />
          <Component {...pageProps} />
        </QueryClientProvider>
      </SessionProvider>
    </>
  );
}

export default ScamLog;
