import type { NextPage } from "next";
import Link from "next/link";
import { NextSeo } from "next-seo";
import Footer from "../components/Footer";
import { Container, Text } from "@mantine/core";
const NotFound: NextPage = () => {
  return (
    <>
      <Container sx={{ mt: 5 }} style={{ minHeight: "100vh" }}>
        <NextSeo title="404 Not Found" noindex />
        <h3>404 Not Found</h3>
        <Text>
          Whoops, looks like we can&apos;t find that page, how about going{" "}
          <Link href="/">home</Link>
        </Text>
      </Container>
      <Footer />
    </>
  );
};
export default NotFound;
