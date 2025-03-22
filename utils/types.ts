export type LocationAlert = {
  id: string | number;
  type: "location";
  title: string;
  flow: "enter" | "exit";
  latitude: number;
  longitude: number;
};

export type Time = {
  id: string;
  type: "time";
  title: string;
  time: string;
  frequency: string;
};
