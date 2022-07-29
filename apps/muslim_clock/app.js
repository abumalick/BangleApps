function format(value) {
  return ("0" + value).substr(-2);
}

const Layout = require("Layout");
const ClockFace = require("ClockFace");
const Locale = require("locale");
const hijri_date = require("hijri_date");
const prayer_utils = require("prayer_utils");

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
    this.layout.hijri.label = hijri_date.getHijriDateLabel(date);
    this.layout.date.label = Locale.dow(date, 1) + ", " + Locale.date(date);
    this.layout.time.label = Locale.time(date, 1);
    this.layout.nextPrayer.label = prayer_utils.getPrayerTimeLabel(date);
    this.layout.render();
  },
  // settingsFile: "ffcniftya.json"
});
clock.start();
