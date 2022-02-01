import { Box, Container, Typography, Grid } from "@mui/material";
import type { NextPage } from "next";
import Leaderboard from "../components/Leaderboard";
import { GAMES, GAME_FRIENDLY_NAME } from "../lib/consts";

const Home: NextPage = () => {
  return (
    <Container sx={{ mt: 5 }}>
      <Typography variant="h3">Hive Leaderboards</Typography>
      <Grid container spacing={10}>
        {GAMES.map((game) => (
          <Grid item key={game}>
            <Typography variant="h4">{GAME_FRIENDLY_NAME[game]}</Typography>
            <Leaderboard game={game} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Home;
