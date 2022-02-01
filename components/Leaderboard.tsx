import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { NextPage } from "next";
import { Game } from "../lib/types";
import useSWR, { Fetcher } from "swr";
import { useEffect, useState } from "react";
interface Props {
  game: Game;
  length?: number;
}
const fetcher: Fetcher<Array<any>> = (url: string) =>
  fetch(url).then((res) => res.json());

const Leaderboard: NextPage<Props> = ({ game, length = 3 }) => {
  const { data, error } = useSWR(
    "https://api.playhive.com/v0/game/monthly/" + game.toLowerCase(),
    fetcher
  );
  const leaderboardData = data?.slice(0, length);

  return (
    <TableContainer sx={{ my: 5 }}>
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
  );
};

export default Leaderboard;
