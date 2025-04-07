export type Nullable<T> = null | T;

export const Flow = {
  enter: "enter",
  exit: "exit",
} as const;
export type Flow = (typeof Flow)[keyof typeof Flow];

export const ReminderType = {
  location: "location",
  time: "time",
} as const;
export type ReminderType = (typeof ReminderType)[keyof typeof ReminderType];

export type LocationReminder = {
  id: string;
  type: "location";
  title: string;
  flow: Flow;
  placeId: string;
};

export type TimeAlert = {
  id: string;
  type: "time";
  title: string;
  time: string;
  frequency: string;
};
