export type PulseMode = "full" | "books" | "personal" | "";

export type NamedAmount = { name: string; amt: string };

export type FeelBiz = "slow" | "normal" | "busy";
export type FeelPersonal = "tight" | "okay" | "comfortable";
export type Feel = FeelBiz | FeelPersonal | "";

export type WeekData = {
  inc: string;
  jobCosts: NamedAmount[];
  moved: boolean;
  taxAmt: string;
  bills: NamedAmount[];
  sup: string;
  bizPersonal: NamedAmount[];
  feel: Feel;
  drove: string;
  paid: string;
  payType: "" | "set" | "whatever";
  other: string;
  pbills: NamedAmount[];
  persBiz: NamedAmount[];
  surprises: NamedAmount[];
  noticed: string;
  done: boolean;
};

export type MapBill = { name: string; due: string; amt: string };
export type MapCheck = { date: string; amt: string; bills: MapBill[] };
export type MapYearly = { name: string; when: string; amt: string };

export type MoneyMap = {
  checks: MapCheck[];
  yearly: MapYearly[];
};

export type PulseSettings = {
  taxRate: number | string;
  introSeen: boolean;
  mode: PulseMode;
  need: string;
  taxSavings: string;
};

export type PulseState = {
  settings: PulseSettings;
  weeks: Record<string, WeekData>;
  map: MoneyMap;
  updatedAt: number;
};

export type TabId = "biz" | "me" | "map" | "pat";

export type CalcResult = {
  inc: number;
  jobs: number;
  made: number;
  tax: number;
  bills: number;
  sup: number;
  left: number;
  bp: number;
  paid: number;
  other: number;
  pb: number;
  living: number;
  pbiz: number;
  surp: number;
};
