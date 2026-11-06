import {
  JOB_COSTS,
  THIS_WEEK,
  addWeeks,
  blankWeek,
  freshState,
} from "./math";
import type { Feel, PulseState } from "./types";

/** Nine weeks of stylist example data from the original artifact. */
export function loadDemoState(): PulseState {
  const S = freshState();
  S.settings.introSeen = true;
  S.settings.mode = "full";
  S.settings.need = "3400";
  S.settings.taxSavings = "2900";

  const data: [number, string, string, number][] = [
    [1850, "normal", "Regulars plus two walk-ins", 650],
    [2100, "normal", "Steady regulars", 700],
    [1400, "slow", "Rain all week, three cancellations", 450],
    [1150, "slow", "Two regulars out of town", 350],
    [2650, "busy", "Homecoming weekend", 800],
    [980, "slow", "Sick two days", 250],
    [1720, "normal", "Back to normal", 650],
    [3100, "busy", "Wedding party filled Saturday", 900],
    [2240, "normal", "Regulars plus one color client", 700],
  ];

  data.forEach((d, i) => {
    const id = addWeeks(THIS_WEEK, i - (data.length - 1));
    S.weeks[id] = Object.assign(blankWeek(), {
      inc: String(d[0]),
      moved: i !== 5,
      feel: d[1] as Feel,
      drove: d[2],
      paid: String(d[3]),
      payType: i > 5 ? "set" : "whatever",
      jobCosts: JOB_COSTS
        ? [
            {
              name: "Color and product used",
              amt: String(Math.round(d[0] * 0.09)),
            },
          ]
        : [],
      sup: String(Math.round(d[0] * (JOB_COSTS ? 0.04 : 0.1))),
      bills: [{ name: "Booth rent", amt: "325" }],
      done: true,
    });
  });

  Object.assign(S.weeks[THIS_WEEK], {
    jobCosts: JOB_COSTS
      ? [
          { name: "Color and product used", amt: "185" },
          { name: "Shampoo assistant, Saturday", amt: "150" },
        ]
      : [],
    bills: [
      { name: "Booth rent", amt: "325" },
      { name: "Booking app", amt: "45" },
    ],
    sup: JOB_COSTS ? "90" : "240",
    bizPersonal: [
      {
        name: "Developer and foils (paid on my debit card)",
        amt: "84",
      },
    ],
    other: "1150",
    pbills: [
      { name: "Car note", amt: "412" },
      { name: "Phone", amt: "95" },
      { name: "Groceries", amt: "220" },
    ],
    persBiz: [{ name: "Electric bill", amt: "138" }],
    noticed:
      "Paid the electric bill from the shop account again. Moving it to personal next week.",
    done: false,
  });

  return S;
}
