import React from "react";
import Clock from "react-clock";
import "react-clock/dist/Clock.css";
import styled from "@emotion/styled";
import {
  useTerminalDispatch,
  useTerminalSelector,
} from "../redux/terminalStore";
import { setScreensaver } from "../redux/features/terminalSlice";

const StyledScreensaver = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 99;
  background-color: #000000;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledClockContainer = styled.div`
  position: relative;

  .react-clock {
    width: 12em !important;
    height: 12em !important;
  }

  .react-clock__face {
    border-color: #000000;
  }

  .react-clock__mark__body {
    background-color: #ffffff;
  }

  .react-clock__hand__body {
    background-color: #ffffff;
  }

  .react-clock__second-hand__body {
    background-color: var(--theme-color);
  }

  .react-clock__second-hand {
    transition: transform cubic-bezier(0.68, 0, 0.27, 1.55) 0.12s;
  }
`;

const StyledDateDimeString = styled.div`
  padding-top: 2em;
  text-align: center;
  color: #ffffff;
  font-size: 1.2em;

  span:first-of-type {
    padding-right: 0.6em;
  }
`;

const useDate = () => {
  const locale = "en";
  const [today, setDate] = React.useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => setDate(new Date()), 1000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  const day = today.toLocaleDateString(locale, { weekday: "short" });
  const dateString = `${day} ${today.getDate()}. ${today.toLocaleDateString(
    locale,
    { month: "short" }
  )}`;
  const timeString = today.toLocaleTimeString(locale, {
    hour: "numeric",
    hour12: false,
    minute: "numeric",
  });

  return {
    today,
    dateString,
    timeString,
  };
};

export const ScreensaverClock = () => {
  const { today, dateString, timeString } = useDate();

  const isActive = useTerminalSelector(
    (state) => state.terminalState.screensaver
  );
  const dispatch = useTerminalDispatch();

  if (!isActive) {
    return <></>;
  }

  return (
    <StyledScreensaver onClick={() => dispatch(setScreensaver(false))}>
      <StyledClockContainer>
        <Clock
          value={today}
          hourHandLength={60}
          hourHandOppositeLength={20}
          hourHandWidth={8}
          hourMarksLength={20}
          hourMarksWidth={8}
          minuteHandLength={90}
          minuteHandOppositeLength={20}
          minuteHandWidth={6}
          minuteMarksLength={6}
          minuteMarksWidth={3}
          secondHandLength={75}
          secondHandOppositeLength={25}
          secondHandWidth={3}
        />
        <StyledDateDimeString>
          <span>{dateString}</span>
          <span>{timeString}</span>
        </StyledDateDimeString>
      </StyledClockContainer>
    </StyledScreensaver>
  );
};
