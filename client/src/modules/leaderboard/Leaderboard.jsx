import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Loading,
  ProgressBar,
  Text,
  FONT_SIZES,
} from "../../components";
import { useClient } from "../../client";
import { GET_AFFILIATE_DOWNLOADS } from "../../graphql/queries";
import { COLORS } from "../../constants";

const Leaderboard = () => {
  const client = useClient();
  const [leaderboard, setLeaderboard] = useState({
    affiliates: [],
    goal: 1000,
    reportDate: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLeaderboard = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await client.request(GET_AFFILIATE_DOWNLOADS);
      if (response && response.getAffiliateDownloads) {
        setLeaderboard(response.getAffiliateDownloads);
      } else {
        setLeaderboard({ affiliates: [], goal: 1000, reportDate: "" });
      }
    } catch (err) {
      console.error("Error loading affiliate downloads:", err);
      setError(
        "We couldn't load the latest affiliate downloads. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const goal = useMemo(() => {
    const parsedGoal = Number(leaderboard.goal);
    if (!Number.isFinite(parsedGoal) || parsedGoal <= 0) {
      return 1000;
    }

    return parsedGoal;
  }, [leaderboard.goal]);

  const affiliates = useMemo(() => {
    if (!leaderboard.affiliates) {
      return [];
    }

    return [...leaderboard.affiliates].sort(
      (first, second) => second.downloads - first.downloads
    );
  }, [leaderboard.affiliates]);

  let formattedReportDate = null;
  if (leaderboard.reportDate) {
    const date = new Date(`${leaderboard.reportDate}T00:00:00Z`);
    if (!Number.isNaN(date.getTime())) {
      formattedReportDate = date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
  }

  return (
    <Box
      width="100%"
      justifyContent="center"
      alignItems="center"
      backgroundColor={COLORS.black}
      paddingX={16}
      paddingY={32}
      style={{ minHeight: "calc(100vh - 60px)" }}
    >
      <Box
        column
        width="100%"
        maxWidth={960}
        backgroundColor={COLORS.darkestGrey}
        borderRadius={16}
        padding={24}
        boxShadow="0 12px 32px rgba(0, 0, 0, 0.45)"
      >
        <Text
          fontSize={FONT_SIZES.XX_LARGE}
          bold
          color={COLORS.white}
          marginBottom="8px"
        >
          Affiliate Leaderboard
        </Text>
        <Text color={COLORS.lightGrey} marginBottom="24px">
          App Store Connect data updates once per day and typically arrives
          with about a two day delay.
        </Text>
        {formattedReportDate && (
          <Text color={COLORS.lightBlue} marginBottom="16px" bold>
            Latest report: {formattedReportDate}
          </Text>
        )}

        <Box alignItems="center" marginBottom="16px">
          <Button
            type="button"
            width="auto"
            padding="8px 16px"
            color={COLORS.vividBlue}
            onClick={fetchLeaderboard}
            disabled={loading}
          >
            Refresh
          </Button>
        </Box>

        {loading ? (
          <Loading ring size={48} />
        ) : error ? (
          <Box column alignItems="flex-start">
            <Text color={COLORS.red} marginBottom="8px">
              {error}
            </Text>
            <Text color={COLORS.lightGrey}>
              If the issue continues, double-check the App Store Connect
              credentials and try again later.
            </Text>
          </Box>
        ) : affiliates.length ? (
          <Box column width="100%">
            {affiliates.map((affiliate, index) => {
              const downloads = Number(affiliate.downloads) || 0;
              return (
                <Box
                  key={`${affiliate.affiliateName}-${index}`}
                  column
                  card
                  width="100%"
                  backgroundColor={COLORS.darkGrey}
                  marginBottom="16px"
                  padding={16}
                >
                  <Box
                    width="100%"
                    justifyContent="space-between"
                    alignItems="center"
                    flexWrap="wrap"
                  >
                    <Text
                      color={COLORS.white}
                      bold
                      fontSize={FONT_SIZES.LARGE}
                      margin={0}
                    >
                      {`${index + 1}. ${affiliate.affiliateName}`}
                    </Text>
                    <Text
                      color={COLORS.lightBlue}
                      fontSize={FONT_SIZES.LARGE}
                      margin={0}
                      noWrap
                    >
                      {downloads.toLocaleString()} downloads
                    </Text>
                  </Box>
                  <Box width="100%" marginTop="12px" justifyContent="flex-start">
                    <ProgressBar
                      completed={Math.min(downloads, goal)}
                      total={goal}
                    />
                  </Box>
                </Box>
              );
            })}
          </Box>
        ) : (
          <Box column>
            <Text color={COLORS.white} marginBottom="8px">
              We couldn't find any affiliate downloads for the latest report
              yet.
            </Text>
            <Text color={COLORS.lightGrey}>
              Check back soon—App Store Connect can take a couple of days to
              release new numbers.
            </Text>
          </Box>
        )}

        <Text color={COLORS.lightGrey} marginTop="24px">
          Each progress bar tracks progress toward {goal.toLocaleString()} total
          downloads.
        </Text>
      </Box>
    </Box>
  );
};

export default Leaderboard;
