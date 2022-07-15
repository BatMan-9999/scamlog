import "../styles/globals.css";
import "react-toastify/dist/ReactToastify.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "react-query";
import Head from "next/head";
import { ReactQueryDevtools } from "react-query/devtools";
import { ToastContainer } from "react-toastify";
import dynamic from "next/dynamic";

// Dynamic Imports
const HeadTags = dynamic(() => import("@/common/components/base/HeadTags"))
const NavBar = dynamic(() => import("@/common/components/nav/NavBar"));

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
            <NavBar
              links={[
                {
                  name: "Home",
                  url: "/",
                },
                {
                  name: "Report",
                  url: "/reports/add",
                },
              ]}
            />
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
