import type { GetServerSideProps, NextPage } from "next";
import Leaderboard from "../components/Leaderboard";
import { GAMES, GAME_FRIENDLY_NAME } from "../lib/consts";
import { useState } from "react";
import { NextSeo } from "next-seo";
import { Box, Button, Grid, TextInput, Container } from "@mantine/core";
import { User } from "tabler-icons-react";
import { useForm } from "@mantine/form";
import { useRouter } from "next/router";
import { useEffect } from "react";
interface Props {
  username: string | undefined;
}
const LeaderboardsMonthly: NextPage<Props> = ({ username }) => {
  const router = useRouter();
  // @ts-expect-error
  const usernameFromParams: string | undefined =
    username ?? router.query.username;
  const [lookupUsername, setLookupUsername] = useState<string | undefined>(
    usernameFromParams
  );
  const usernameForm = useForm({
    initialValues: {
      username: "",
    },
    validate: {
      username: (value) => (value ? null : "Enter a username"),
    },
  });
  useEffect(() => {
    usernameFromParams &&
      usernameForm.setFieldValue("username", usernameFromParams);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usernameFromParams]);

  function handleUsernameFormSubmit(values: typeof usernameForm.values) {
    setLookupUsername(values.username);
  }
  return (
    <>
      <NextSeo
        title="Monthly Leaderboards"
        description="Check the Hive monthly leaderboards and your personal stats on this site!"
        openGraph={{
          type: "website",
          locale: "en_UK",
          url: "https://hive.jaminit.co.uk/leaderboards",
          site_name: "Hive Info",
          title: "Hive Monthly Leaderboards",
          description:
            "Check the Hive monthly leaderboards and your personal stats on this site!",
        }}
      />
      <Container size="xl">
        <h1>Hive Monthly Leaderboards</h1>
        <Box sx={{ maxWidth: 250 }}>
          <form onSubmit={usernameForm.onSubmit(handleUsernameFormSubmit)}>
            <TextInput
              label="Username"
              type="text"
              icon={<User />}
              {...usernameForm.getInputProps("username")}
            />
            <Button variant="filled" type="submit" sx={{ marginTop: 10 }}>
              Search
            </Button>
          </form>
        </Box>
        <Grid gutter="md">
          {GAMES.map((game) => (
            <Grid.Col key={game} sx={{ maxWidth: 400 }}>
              <h2>{GAME_FRIENDLY_NAME[game]}</h2>
              <Leaderboard game={game} username={lookupUsername} />
            </Grid.Col>
          ))}
        </Grid>
      </Container>
    </>
  );
};
export default LeaderboardsMonthly;
export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: { username: context.query.username ?? null },
  };
};
