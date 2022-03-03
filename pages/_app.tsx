import { CssBaseline, ThemeProvider } from "@mui/material";
import type { AppProps } from "next/app";
import { theme } from "../lib/theme";
import { DefaultSeo } from "next-seo";
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <DefaultSeo
        openGraph={{
          type: "website",
          locale: "en_UK",
          url: "https://hive.jaminit.co.uk",
          site_name: "Hive Info",
        }}
        titleTemplate="%s | Hive Info"
      />
      <CssBaseline />
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;
