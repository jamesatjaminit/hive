import { NextPage } from "next";
import type { Game, LeaderboardEntry } from "../lib/types";
import { useState, useEffect } from "react";
import useSWR from "swr";
import { Box, Button, Grid, Table, useMantineTheme } from "@mantine/core";
import { useScrollIntoView, useMediaQuery } from "@mantine/hooks";
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
  const theme = useMantineTheme();
  const isMobile = useMediaQuery("(max-width: 500px)");
  const { scrollIntoView, targetRef } = useScrollIntoView<HTMLDivElement>({
    offset: 60,
  });
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
    if (cutOffPoint == 3 && isMobile) {
      scrollIntoView();
    }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rawLeaderboardData, cutOffPoint, isPlayerEntryValidating]);
  return (
    <Box ref={targetRef}>
      <Table horizontalSpacing="sm" striped>
        <thead>
          <tr>
            <th>Position</th>
            <th>Username</th>
            <th>Games Played</th>
            <th>Games Won</th>
          </tr>
        </thead>
        <tbody>
          {leaderboardData &&
            leaderboardData.map((row) => (
              <tr
                key={row.index}
                style={{
                  backgroundColor:
                    row.username.toLowerCase() == username?.toLowerCase()
                      ? theme.colors.grape[9]
                      : undefined,
                }}
              >
                <th>{row.human_index ?? "N/A"}</th>
                <th>{row.username ?? "N/A"}</th>
                <th>{row.played ?? "0"}</th>
                <th>{row.victories ?? "0"}</th>
              </tr>
            ))}
        </tbody>
      </Table>
      <Grid justify="center" sx={{ marginTop: 20 }}>
        <Button onClick={toggleCutOff} variant="outline">
          Show {cutOffPoint != 3 ? "Less" : "More"}
        </Button>
      </Grid>
    </Box>
  );
};

export default Leaderboard;
