import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const SCREENSAVER_TIMEOUT = 300_000;
const NOTIFICATION_TIMEOUT = 5_000;

export enum NotificationType {
  GENERAL,
  NFC,
  QR,
}

export enum NotificationColor {
  INFO,
  WARN,
  ERROR,
}

export interface Notification {
  type: NotificationType;
  color: NotificationColor;
  title: string;
  description: string;
  timeout: number;
}

type PaymentState = {
  screensaver: boolean;
  screensaverTimeout: number;
  notifications: Notification[];
};
const initialState: PaymentState = {
  screensaver: false,
  screensaverTimeout: 0,
  notifications: [],
};
export const terminalSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    setScreensaver: (state, action: PayloadAction<boolean>) => {
      state.screensaver = action.payload;
      if (!action.payload) {
        state.screensaverTimeout = Date.now() + SCREENSAVER_TIMEOUT;
      }
    },
    checkTimeouts: (state) => {
      const now = Date.now();

      if (!state.screensaver && state.screensaverTimeout < now) {
        state.screensaver = true;
      }

      if (state.notifications.length > 0) {
        state.notifications = state.notifications.filter(
          (n) => n.timeout >= now
        );
      }
    },
    showNotification: (
      state,
      action: PayloadAction<{
        type: NotificationType;
        title: string;
        color?: NotificationColor;
        description?: string;
      }>
    ) => {
      let list = state.notifications.slice();
      list.push({
        type: action.payload.type,
        title: action.payload.title,
        color: action.payload.color ?? NotificationColor.INFO,
        description: action.payload.description ?? "",
        timeout: Date.now() + NOTIFICATION_TIMEOUT,
      });
      state.notifications = list;
    },
    hideNotification: (state, action: PayloadAction<Notification>) => {
      const index = state.notifications.findIndex(
        (n) =>
          n.color === action.payload.color &&
          n.type === action.payload.type &&
          n.title === action.payload.title &&
          n.description === action.payload.description &&
          n.timeout === action.payload.timeout
      );
      if (index >= 0) {
        let list = state.notifications.slice();
        list.splice(index, 1);
        state.notifications = list;
      }
    },
  },
});

export const {
  setScreensaver,
  checkTimeouts,
  showNotification,
  hideNotification,
} = terminalSlice.actions;
export default terminalSlice.reducer;
