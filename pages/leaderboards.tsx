import { Container, Typography, Grid, Button, TextField } from "@mui/material";
import type { NextPage } from "next";
import Leaderboard from "../components/Leaderboard";
import { GAMES, GAME_FRIENDLY_NAME } from "../lib/consts";
import { useState, FormEvent } from "react";
import { NextSeo } from "next-seo";

const Leaderboards: NextPage = () => {
  const [lookupUsername, setLookupUsername] = useState();
  function submitUsername(e: FormEvent) {
    e.preventDefault();
    // @ts-expect-error
    setLookupUsername(e.target.username_input.value);
  }
  return (
    <>
      <NextSeo
        title="Leaderboards"
        description="Check the Hive leaderboards and your personal stats on this site!"
        openGraph={{
          type: "website",
          locale: "en_UK",
          url: "https://hive.jaminit.co.uk/leaderboards",
          site_name: "Hive Info",
          title: "Hive Leaderboards",
          description:
            "Check the Hive leaderboards and your personal stats on this site!",
        }}
      />
      <Container sx={{ mt: 5, mb: 10 }}>
        <Typography variant="h3" sx={{ mb: 2 }}>
          Hive Leaderboards
        </Typography>
        <form onSubmit={submitUsername}>
          <TextField
            variant="filled"
            label="Username"
            id="username_input"
            sx={{ mr: 3 }}
          />
          <Button variant="contained" type="submit" sx={{ mt: 1 }}>
            Search
          </Button>
        </form>

        <Grid container spacing={10} sx={{ pt: 3 }}>
          {GAMES.map((game) => (
            <Grid item key={game}>
              <Typography variant="h4">{GAME_FRIENDLY_NAME[game]}</Typography>
              <Leaderboard game={game} username={lookupUsername} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
};

export default Leaderboards;
