import React from "react";
import styled from "styled-components";

const StyledApp = styled.div`
  background-color: #393d46;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
`;

export function App() {
  return (
    <StyledApp>
      Dashboard
    </StyledApp>
  );
}
