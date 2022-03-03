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
  const [cutOffPoint, setCutOffPoint] = useState(3);
  const [userEntry, setUserEntry] = useState<LeaderboardEntry>();
  const [rawLeaderboardData, setRawLeaderboardData] =
    useState<Array<LeaderboardEntry>>();
  const [leaderboardData, setLeaderboardData] =
    useState<Array<LeaderboardEntry>>();
  function toggleCutOff() {
    setCutOffPoint(cutOffPoint == 3 ? 10 : 3);
  }
  useEffect(() => {
    async function fetchLeaderboardData() {
      const response = await fetch(
        "https://api.playhive.com/v0/game/monthly/" + game.toLowerCase()
      );
      setRawLeaderboardData(await response.json());
    }
    fetchLeaderboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    async function fetchUserEntry() {
      if (username) {
        const response = await fetch(
          `https://api.playhive.com/v0/game/monthly/player/${game.toLowerCase()}/${username}`
        );
        if (response.status == 200) {
          setUserEntry(await response.json());
        } else {
          setUserEntry({
            index: -1,
            username: username,
          });
        }
      }
    }
    fetchUserEntry();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username]);
  useEffect(() => {
    if (rawLeaderboardData) {
      let leaderboardDataSplit = rawLeaderboardData?.slice(0, cutOffPoint);
      let leaderboardDataTemp = leaderboardDataSplit;
      if (userEntry) {
        for (let i = 0; i < leaderboardDataSplit.length; i++) {
          const currentEntry = leaderboardDataSplit[i];
          if (currentEntry.username == userEntry?.username) {
            break;
          } else if (i == leaderboardDataSplit.length - 1) {
            leaderboardDataTemp = insertIntoArray(
              leaderboardDataSplit,
              i + 1,
              userEntry
            );
          }
        }
      }
      setLeaderboardData(leaderboardDataTemp);
    }
  }, [rawLeaderboardData, userEntry, cutOffPoint]);
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
                  <TableCell>{row.victories ?? "N/A"}</TableCell>
                  <TableCell>{row.played ?? "N/A"}</TableCell>
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
