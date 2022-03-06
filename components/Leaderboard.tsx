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
import { theme } from "../lib/theme";
import { NextPage } from "next";
import type { Game, LeaderboardEntry } from "../lib/types";
import { useState, useEffect } from "react";
import useSWR from "swr";
interface Props {
  game: Game;
  username?: string;
}
const insertIntoArray = (arr: Array<any>, index: number, newItem: unknown) => [
  // part of the array before the specified index
  ...arr.slice(0, index),
  // inserted item
  newItem,
  // part of the array after the specified index
  ...arr.slice(index),
];

const Leaderboard: NextPage<Props> = ({ game, username }) => {
  const mainLeaderboardFetcher = (url: string) =>
    fetch(url).then((r) => r.json());
  const playerLeaderboardFetcher = () =>
    fetch(
      `https://api.playhive.com/v0/game/monthly/player/${game.toLowerCase()}/${username}`
    ).then((r) => r.json() ?? null);
  const [cutOffPoint, setCutOffPoint] = useState(3);
  const [leaderboardData, setLeaderboardData] =
    useState<Array<LeaderboardEntry>>();
  function toggleCutOff() {
    setCutOffPoint(cutOffPoint == 3 ? 10 : 3);
  }
  const { data: rawLeaderboardData, error: mainLeaderboardError } = useSWR(
    "https://api.playhive.com/v0/game/monthly/" + game.toLowerCase(),
    mainLeaderboardFetcher
  );
  const shouldFetchPlayer = !!username;
  let {
    data: userEntry,
    error: playerEntryError,
    isValidating: isPlayerEntryValidating,
  } = useSWR(
    shouldFetchPlayer ? username + game : null,
    playerLeaderboardFetcher
  );
  useEffect(() => {
    if (rawLeaderboardData && !isPlayerEntryValidating) {
      let leaderboardDataSplit = rawLeaderboardData?.slice(0, cutOffPoint);
      let leaderboardDataTemp = leaderboardDataSplit;
      if (username) {
        for (let i = 0; i < leaderboardDataSplit.length; i++) {
          const currentEntry = leaderboardDataSplit[i];
          if (currentEntry.username == username) {
            break;
          } else if (i == leaderboardDataSplit.length - 1) {
            console.log(userEntry?.username);
            leaderboardDataTemp = insertIntoArray(
              leaderboardDataSplit,
              i + 1,
              userEntry ?? { username }
            );
          }
        }
      }

      setLeaderboardData(leaderboardDataTemp);
    }
  }, [rawLeaderboardData, cutOffPoint, isPlayerEntryValidating]);
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
                <TableRow
                  key={row.index}
                  style={{
                    backgroundColor:
                      row.username == username
                        ? theme.palette.grey[800]
                        : undefined,
                  }}
                >
                  <TableCell>{row.human_index ?? "N/A"}</TableCell>
                  <TableCell>{row.username ?? "N/A"}</TableCell>
                  <TableCell>{row.played ?? "0"}</TableCell>
                  <TableCell>{row.victories ?? "0"}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Grid container justifyContent="center">
        <Button onClick={toggleCutOff}>
          Show {cutOffPoint != 3 ? "Less" : "More"}
        </Button>
      </Grid>
    </Box>
  );
};

export default Leaderboard;
