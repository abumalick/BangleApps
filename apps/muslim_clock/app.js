function getUnixTime(date) {
  return Math.floor(date.getTime() / 1000);
}

function format(value) {
  return ("0" + value).substr(-2);
}

const prayerNames = ["Fajr", "Churuk", "Dhor", "Asr", "Maghreb", "'Icha"];

const prayerTimes = [
  [1657926000, 18180, 24420, 49500, 62460, 74460, 79920],
  [1658012400, 18240, 24420, 49500, 62460, 74460, 79920],
  [1658098800, 18300, 24480, 49500, 62460, 74400, 79860],
  [1658185200, 18360, 24480, 49500, 62460, 74400, 79800],
  [1658271600, 18420, 24540, 49500, 62460, 74340, 79740],
  [1658358000, 18480, 24600, 49500, 62460, 74340, 79740],
  [1658444400, 18480, 24600, 49500, 62460, 74280, 79680],
  [1658530800, 18540, 24660, 49500, 62520, 74280, 79620],
  [1658617200, 18600, 24660, 49560, 62520, 74220, 79560],
  [1658703600, 18660, 24720, 49560, 62520, 74220, 79560],
  [1658790000, 18720, 24780, 49560, 62520, 74160, 79500],
  [1658876400, 18780, 24780, 49560, 62520, 74100, 79440],
  [1658962800, 18840, 24840, 49560, 62520, 74100, 79380],
  [1659049200, 18900, 24840, 49500, 62520, 74040, 79320],
  [1659135600, 18960, 24900, 49500, 62520, 73980, 79260],
  [1659222000, 19020, 24960, 49500, 62460, 73980, 79200],
  [1659308400, 19080, 24960, 49500, 62460, 73920, 79140],
  [1659394800, 19080, 25020, 49500, 62460, 73860, 79080],
  [1659481200, 19140, 25020, 49500, 62460, 73800, 79020],
  [1659567600, 19200, 25080, 49500, 62460, 73800, 78960],
  [1659654000, 19260, 25140, 49500, 62460, 73740, 78900],
  [1659740400, 19320, 25140, 49500, 62460, 73680, 78840],
  [1659826800, 19380, 25200, 49500, 62460, 73620, 78780],
  [1659913200, 19440, 25260, 49500, 62400, 73560, 78720],
  [1659999600, 19500, 25260, 49440, 62400, 73500, 78600],
  [1660086000, 19560, 25320, 49440, 62400, 73500, 78540],
  [1660172400, 19620, 25320, 49440, 62400, 73440, 78480],
  [1660258800, 19680, 25380, 49440, 62400, 73380, 78420],
  [1660345200, 19680, 25440, 49440, 62340, 73320, 78360],
  [1660431600, 19740, 25440, 49440, 62340, 73260, 78300],
  [1660518000, 19800, 25500, 49380, 62340, 73200, 78180],
];

const Layout = require("Layout");
const ClockFace = require("ClockFace");
const Locale = require("locale");
const { getHijriDateLabel } = require("hijri_date");

const clock = new ClockFace({
  init: function () {
    this.layout = new Layout({
      type: "v",
      c: [
        { type: "txt", font: "10%", label: "17 Dhul Hijja 1443", id: "hijri" },
        {
          type: "txt",
          font: "10%",
          label: "Sat, Jul 16 2022",
          id: "date",
          pad: 5,
        },
        { type: "txt", font: "35%", label: "12:00", id: "time", filly: 1 },
        { type: "txt", font: "12%", label: "Fajr 5:15", id: "nextPrayer" },
      ],
      lazy: true,
    });
    g.clear();
  },
  draw: function (date) {
    this.layout.hijri.label = getHijriDateLabel(date);
    this.layout.date.label = Locale.dow(date, 1) + ", " + Locale.date(date);
    this.layout.time.label = Locale.time(date, 1);

    // Get prayer times
    const todayTimeStamp = getUnixTime(date);
    const tomorrowPrayersIndex = prayerTimes.findIndex(
      (p) => p[0] > todayTimeStamp
    );
    if (tomorrowPrayersIndex === 0 || tomorrowPrayersIndex === -1) {
      throw new Error("No prayer times for today");
    }
    const todayPrayers = prayerTimes[tomorrowPrayersIndex - 1];

    // Get next prayer
    const timeToShowCurrentPrayer = 30 * 60;
    const nowTimeStamp =
      date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds();
    let nextPrayerTimeStamp;
    let prayerName;
    for (let index = 1; index < todayPrayers.length; index++) {
      const prayerTimeStamp = todayPrayers[index];
      if (prayerTimeStamp + timeToShowCurrentPrayer > nowTimeStamp) {
        nextPrayerTimeStamp = prayerTimeStamp;
        prayerName = prayerNames[index - 1];
        break;
      }
    }
    if (!nextPrayerTimeStamp) {
      nextPrayerTimeStamp = prayerTimes[tomorrowPrayersIndex][1];
      prayerName = prayerNames[0];
    }
    if (nextPrayerTimeStamp > nowTimeStamp) {
      // Display next prayer time
      const nextPrayerDate = new Date();
      const hours = nextPrayerTimeStamp / 3600;
      let rest = nextPrayerTimeStamp % 3600;
      const minutes = rest / 60;
      nextPrayerDate.setHours(hours);
      nextPrayerDate.setMinutes(minutes);
      nextPrayerDate.setSeconds(0);
      this.layout.nextPrayer.label =
        prayerName + " " + Locale.time(nextPrayerDate, 1);
    } else {
      // Display time since start of current prayer
      const timeSincePrayer = nowTimeStamp - nextPrayerTimeStamp;
      const minutes = Math.round(timeSincePrayer / 60);
      this.layout.nextPrayer.label = prayerName + " " + minutes + "'";
    }

    this.layout.render();
    return;
  },
  // settingsFile: "ffcniftya.json"
});
clock.start();
