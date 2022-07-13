import "../styles/globals.css";
import type { AppProps } from "next/app";
import NavBar from "@/common/components/nav/NavBar";
import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "react-query";
import Head from "next/head";
import HeadTags from "@/common/components/base/HeadTags";
import { ReactQueryDevtools } from "react-query/devtools";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

const client = new QueryClient();

function ScamLog({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <>
      <div className="scrollbar-thumb-gray-900 scrollbar-track-gray-100">
        <SessionProvider session={session}>
          <QueryClientProvider client={client}>
            <Head>
              <HeadTags />
              <title>Scam Log</title>
            </Head>
            <NavBar links={[]} />
            <Component {...pageProps} />
            <ToastContainer theme="dark" />
            <ReactQueryDevtools />
          </QueryClientProvider>
        </SessionProvider>
      </div>
    </>
  );
}

export default ScamLog;
