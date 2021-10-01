import React from 'react';
import Clock from 'react-clock';

import './Screensaver.scss';
import 'react-clock/dist/Clock.css';
import { useAppDispatch, useAppSelector } from '../store';
import { setScreensaver } from '../payment/paymentSlice';

const useDate = () => {
  const locale = 'en';
  const [today, setDate] = React.useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => setDate(new Date()), 1000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  const day = today.toLocaleDateString(locale, { weekday: 'short' });
  const datestring = `${day} ${today.getDate()}. ${today.toLocaleDateString(locale, { month: 'short' })}`;
  const timestring = today.toLocaleTimeString(locale, { hour: 'numeric', hour12: false, minute: 'numeric' });

  return {
    today,
    datestring,
    timestring,
  };
};

export default function Screensaver() {
  const { today, datestring, timestring } = useDate();

  const isActive = useAppSelector((state) => state.payment.screensaver);
  const dispatch = useAppDispatch();

  if (!isActive) {
    return <></>;
  }

  return (
    <div className="screensaver" onClick={() => dispatch(setScreensaver(false))}>
      <div className="clock-container">
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
        <div className="date-time-string">
          <span>{datestring}</span>
          <span>{timestring}</span>
        </div>
      </div>
    </div>
  );
}
