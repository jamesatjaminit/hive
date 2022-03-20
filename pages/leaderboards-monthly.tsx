import type { NextPage } from "next";
import Leaderboard from "../components/Leaderboard";
import { GAMES, GAME_FRIENDLY_NAME } from "../lib/consts";
import { useState, FormEvent } from "react";
import { NextSeo } from "next-seo";
import { Box, Button, Grid, TextInput, Container } from "@mantine/core";
import { User } from "tabler-icons-react";

const LeaderboardsMonthly: NextPage = () => {
  const [lookupUsername, setLookupUsername] = useState<string>();
  const [usernameFieldError, setUsernameFieldError] = useState<string | null>();
  function submitUsername(e: FormEvent) {
    e.preventDefault();
    // @ts-expect-error
    const username = e.target?.username_input?.value;
    if (username) {
      setLookupUsername(username);
    } else {
      setUsernameFieldError("You must enter a username");
    }
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
          <form onSubmit={submitUsername}>
            <TextInput
              variant="filled"
              label="Username"
              id="username_input"
              size="sm"
              type="text"
              error={usernameFieldError}
              onChange={() => setUsernameFieldError(null)}
              icon={<User />}
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
