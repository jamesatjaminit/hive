import type { NextPage } from "next";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { useEffect } from "react";
const Home: NextPage = () => {
  const router = useRouter();
  useEffect(() => {
    router.push("/leaderboards");
  }, [router]);

  return (
    <>
      <NextSeo
        title="Home"
        description="A site for everything about the Hive. Check leaderboards, stats and more!"
      />
    </>
  );
};
export default Home;
