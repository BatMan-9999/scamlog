import "../styles/globals.css";
import type { AppProps } from "next/app";
import NavBar from "@/common/components/nav/NavBar";
import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "react-query";
import Head from "next/head";
import HeadTags from "@/common/components/base/HeadTags";
import { ReactQueryDevtools } from "react-query/devtools";

const client = new QueryClient();

function ScamLog({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <>
      <SessionProvider session={session}>
        <QueryClientProvider client={client}>
          <Head>
            <HeadTags />
          </Head>
          <NavBar links={[]} />
          <Component {...pageProps} />
          <ReactQueryDevtools />
        </QueryClientProvider>
      </SessionProvider>
    </>
  );
}

export default ScamLog;
