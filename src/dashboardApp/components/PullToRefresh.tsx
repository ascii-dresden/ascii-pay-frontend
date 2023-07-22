import React from "react";
import PullToRefresh from "react-simple-pull-to-refresh";
import { ArrowDownward } from "@mui/icons-material";
import styled from "@emotion/styled";
import { CircularProgress } from "@mui/material";

const StyledPullingContent = styled.div`
  width: 100%;
  height: 4em;
  padding: 0.4em;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledRefreshingContent = styled.div`
  width: 100%;
  height: 4em;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const PullToRefreshWrapper = (props: {
  children: React.ReactNode | React.ReactNode[];
  onRefresh: () => void;
}) => {
  const handleRefresh = async () => {
    props.onRefresh();
  };

  const pullingContent = (
    <StyledPullingContent>
      <ArrowDownward />
    </StyledPullingContent>
  );

  const refreshingContent = (
    <StyledRefreshingContent>
      <CircularProgress color="primary" />
    </StyledRefreshingContent>
  );

  return (
    <PullToRefresh
      onRefresh={handleRefresh}
      pullingContent={pullingContent}
      refreshingContent={refreshingContent}
    >
      <>{props.children}</>
    </PullToRefresh>
  );
};
