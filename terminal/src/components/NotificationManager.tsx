import React from 'react';
import './NotificationManager.scss';
import { useAppDispatch, useAppSelector } from '../store';
import { Notification, NotificationType, hideNotification, NotificationColor } from '../payment/paymentSlice';
import { MdInfoOutline, MdPayment, MdQrCode2 } from 'react-icons/md';

export default function NotificationManager() {
  const notifications = useAppSelector((state) => state.payment.notifications);
  const dispatch = useAppDispatch();

  if (!notifications) {
    return <></>;
  }

  const n = notifications.map((n, i) => (
    <NotificationBox key={i} notification={n} onClose={() => dispatch(hideNotification(n))} />
  ));

  return <div className="notifications">{n}</div>;
}

function NotificationBox(props: { notification: Notification; onClose: () => void }) {
  let color;
  let icon;
  switch (props.notification.type) {
    case NotificationType.GENERAL:
      icon = <MdInfoOutline />;
      break;
    case NotificationType.NFC:
      icon = <MdPayment />;
      break;
    case NotificationType.QR:
      icon = <MdQrCode2 />;
      break;
  }
  switch (props.notification.color) {
    case NotificationColor.INFO:
      color = 'info';
      break;
    case NotificationColor.WARN:
      color = 'warn';
      break;
    case NotificationColor.ERROR:
      color = 'error';
      break;
  }

  return (
    <div className={'notification notification-' + color} onClick={props.onClose}>
      <div className="notification-icon">{icon}</div>
      <div className="notification-title">{props.notification.title}</div>
      <div className="notification-description">{props.notification.description}</div>
    </div>
  );
}
