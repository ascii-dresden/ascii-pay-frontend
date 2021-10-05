import React from 'react';
import { useHistory } from 'react-router-dom';
import { MdLocalAtm, MdPeople, MdSchedule, MdSettings, MdShoppingCart } from 'react-icons/md';
import './StartPage.scss';
import SidebarPage, { SidebarAction } from './components/SidebarPage';
import { setScreensaver } from './payment/paymentSlice';
import { useAppDispatch } from './store';

const useDate = () => {
  const locale = 'en';
  const [today, setDate] = React.useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => setDate(new Date()), 5 * 1000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  const day = today.toLocaleDateString(locale, { weekday: 'short' });
  const date = `${day} ${today.getDate()}. ${today.toLocaleDateString(locale, { month: 'short' })}`;
  const time = today.toLocaleTimeString(locale, { hour: 'numeric', hour12: false, minute: 'numeric' });

  const hour = today.getHours();
  const wish = `Good ${(hour < 12 && 'Morning') || (hour < 17 && 'Afternoon') || 'Evening'}`;

  return {
    date: `${date} ${time}`,
    wish,
  };
};

export default function StartPage() {
  const history = useHistory();
  const handleOpenPayment = () => history.push('/payment');
  const handleOpenAccounts = () => history.push('/accounts');
  const handleOpenRegister = () => history.push('/register');
  const handleOpenSettings = () => history.push('/settings');

  const dispatch = useAppDispatch();
  const { date, wish } = useDate();

  const sidebarActions: SidebarAction[] = [
    {
      title: 'Enable screensaver',
      element: <MdSchedule />,
      action: (event) => {
        event.stopPropagation();
        dispatch(setScreensaver(true));
      },
      bottom: true,
    },
  ];

  return (
    <SidebarPage content={sidebarActions}>
      <div className="start-page">
        <div className="start-page-header">
          <span>{wish}</span>
          <span>{date}</span>
        </div>
        <div className="start-page-menu">
          <div className="start-page-entry" onClick={handleOpenPayment}>
            <MdShoppingCart />
            <span>Payment</span>
          </div>
          <div className="start-page-entry" onClick={handleOpenAccounts}>
            <MdPeople />
            <span>Accounts</span>
          </div>
          <div className="start-page-entry" onClick={handleOpenRegister}>
            <MdLocalAtm />
            <span>Count register</span>
          </div>
          <div className="start-page-entry" onClick={handleOpenSettings}>
            <MdSettings />
            <span>Settings</span>
          </div>
        </div>
      </div>
    </SidebarPage>
  );
}
