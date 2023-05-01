import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ReactElement, ReactNode, useEffect } from "react";
import type { NextPage } from "next";
import { apiCall } from "@/utils/api-utils/api-helper";
import { useRouter } from "next/router";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const router = useRouter();
  useEffect(() => {
    const accessToken = localStorage.getItem("access_token") || "";
    let tokenTimer: NodeJS.Timer | undefined;
    if (accessToken.length > 0) {
      tokenTimer = setInterval(async () => {
        try {
          const refreshTokenResponse = await apiCall(
            "/auth/refresh-token",
            "POST"
          );
          localStorage.setItem(
            "access_token",
            refreshTokenResponse.access_token
          );
        } catch (err) {}
      }, 400000);
    } else {
      router.push("/auth/signin");
    }
    return () => {
      clearInterval(tokenTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page);

  return getLayout(<Component {...pageProps} />);
}
