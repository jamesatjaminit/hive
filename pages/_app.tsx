import type { AppProps } from "next/app";
import { DefaultSeo } from "next-seo";
import {
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
} from "@mantine/core";
import { useColorScheme } from "@mantine/hooks";
import { useState } from "react";
function MyApp({ Component, pageProps }: AppProps) {
  const [colorScheme, setColorScheme] = useState<ColorScheme>("dark");
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));
  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider theme={{ colorScheme }} withGlobalStyles>
        <DefaultSeo
          openGraph={{
            type: "website",
            locale: "en_UK",
            url: "https://hive.jaminit.co.uk",
            site_name: "Hive Info",
          }}
          titleTemplate="%s | Hive Info"
        />
        <Component {...pageProps} />
      </MantineProvider>
    </ColorSchemeProvider>
  );
}

export default MyApp;
