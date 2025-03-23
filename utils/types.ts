export type Nullable<T> = null | T;

export type LocationAlert = {
  id: string | number;
  type: "location";
  title: string;
  flow: "enter" | "exit";
  placeId: string;
};

export type Time = {
  id: string;
  type: "time";
  title: string;
  time: string;
  frequency: string;
};
