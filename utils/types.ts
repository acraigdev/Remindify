export type Nullable<T> = null | T;

export type Flow = "enter" | "exit";

export type LocationReminder = {
  id: number;
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
