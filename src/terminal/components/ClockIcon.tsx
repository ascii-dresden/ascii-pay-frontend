import React from "react";
import Clock from "react-clock";
import "react-clock/dist/Clock.css";
import styled from "@emotion/styled";

const StyledClockIcon = styled.div`
  position: relative;
  width: 1.9rem;
  height: 1.9rem;
  display: flex;
  justify-content: center;
  align-items: center;

  .react-clock {
    width: 100% !important;
    height: 100% !important;
  }

  .react-clock__face {
    border-color: var(--primary-text-color);
    border-width: 4px;
  }

  .react-clock__mark__body {
    background-color: var(--primary-text-color);
  }

  .react-clock__hand__body {
    background-color: var(--primary-text-color);
  }

  .react-clock__second-hand__body {
    background-color: var(--theme-color);
  }

  .react-clock__second-hand {
    transition: transform cubic-bezier(0.68, 0, 0.27, 1.55) 0.12s;
  }
`;

export const ClockIcon = () => {
  const [today, setDate] = React.useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => setDate(new Date()), 1000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <StyledClockIcon>
      <Clock
        value={today}
        hourHandLength={50}
        hourHandOppositeLength={8}
        hourHandWidth={4}
        minuteHandLength={70}
        minuteHandOppositeLength={8}
        minuteHandWidth={3}
        renderHourMarks={false}
        renderMinuteMarks={false}
        renderSecondHand={false}
      />
    </StyledClockIcon>
  );
};
