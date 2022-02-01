import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Box,
} from "@mui/material";
import { NextPage } from "next";
import { Game } from "../lib/types";
import useSWR, { Fetcher } from "swr";
import { useState } from "react";
interface Props {
  game: Game;
}
const fetcher: Fetcher<Array<any>> = (url: string) =>
  fetch(url).then((res) => res.json());

const Leaderboard: NextPage<Props> = ({ game }) => {
  const [cutOffPoint, setCutOffPoint] = useState(3);
  function toggleCutOff(game: Game) {
    setCutOffPoint(cutOffPoint == 3 ? 10 : 3);
  }
  const { data, error } = useSWR(
    "https://api.playhive.com/v0/game/monthly/" + game.toLowerCase(),
    fetcher
  );
  const leaderboardData = data?.slice(0, cutOffPoint);
  return (
    <Box>
      <TableContainer sx={{ my: 5, mb: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Position</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Games Played</TableCell>
              <TableCell>Games Won</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {leaderboardData &&
              leaderboardData.map((row) => (
                <TableRow key={row.index}>
                  <TableCell>{row.human_index ?? "N/A"}</TableCell>
                  <TableCell>{row.username ?? "N/A"}</TableCell>
                  <TableCell>{row.victories ?? "N/A"}</TableCell>
                  <TableCell>{row.played ?? "N/A"}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Grid container justifyContent="center">
        <Button onClick={() => toggleCutOff(game)}>
          Show {cutOffPoint != 3 ? "Less" : "More"}
        </Button>
      </Grid>
    </Box>
  );
};

export default Leaderboard;
