const prayerNames = ["Fajr", "Churuk", "Dhor", "Asr", "Maghreb", "'Icha"];

const prayerTimes = [
  [1661295600, 19320, 25140, 48840, 61860, 72360, 77460],
  [1661382000, 19380, 25140, 48780, 61860, 72300, 77400],
  [1661468400, 19440, 25200, 48780, 61800, 72240, 77280],
  [1661554800, 19500, 25260, 48780, 61800, 72120, 77220],
  [1661641200, 19560, 25320, 48780, 61740, 72060, 77100],
  [1661727600, 19620, 25320, 48720, 61680, 72000, 77040],
  [1661814000, 19680, 25380, 48720, 61680, 71940, 76920],
  [1661900400, 19740, 25440, 48720, 61620, 71820, 76860],
  [1661986800, 19800, 25440, 48660, 61560, 71760, 76740],
  [1662073200, 19860, 25500, 48660, 61560, 71700, 76680],
  [1662159600, 19920, 25560, 48660, 61500, 71580, 76560],
  [1662246000, 19980, 25560, 48600, 61440, 71520, 76500],
  [1662332400, 20040, 25620, 48600, 61440, 71460, 76380],
  [1662418800, 20100, 25680, 48600, 61380, 71340, 76320],
  [1662505200, 20100, 25680, 48540, 61320, 71280, 76200],
  [1662591600, 20160, 25740, 48540, 61260, 71220, 76140],
  [1662678000, 20220, 25800, 48540, 61260, 71100, 76020],
  [1662764400, 20280, 25800, 48480, 61200, 71040, 75960],
  [1662850800, 20340, 25860, 48480, 61140, 70920, 75840],
  [1662937200, 20400, 25920, 48480, 61080, 70860, 75780],
  [1663023600, 20460, 25920, 48420, 61020, 70800, 75660],
  [1663110000, 20460, 25980, 48420, 61020, 70680, 75600],
  [1663196400, 20520, 26040, 48420, 60960, 70620, 75480],
  [1663282800, 20580, 26040, 48360, 60900, 70560, 75420],
  [1663369200, 20640, 26100, 48360, 60840, 70440, 75300],
  [1663455600, 20700, 26160, 48300, 60780, 70380, 75240],
  [1663542000, 20700, 26160, 48300, 60720, 70260, 75120],
  [1663628400, 20760, 26220, 48300, 60720, 70200, 75060],
  [1663714800, 20820, 26280, 48240, 60660, 70140, 74940],
  [1663801200, 20880, 26280, 48240, 60600, 70020, 74880],
  [1663887600, 20940, 26340, 48240, 60540, 69960, 74760],
];

function pad(value) {
  return ("0" + value).substr(-2);
}

function getUnixTime(date) {
  return Math.floor(date.getTime() / 1000);
}

function getNextPrayerLabel(prayerName, timestamp) {
  const hours = Math.floor(timestamp / 3600);
  let rest = timestamp % 3600;
  const minutes = rest / 60;

  return `${prayerName} ${hours}:${pad(minutes)}`;
}

exports.getPrayerTimeLabel = function getPrayerTimeLabel(date) {
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
    // prayer is tomorrow
    nextPrayerTimeStamp = prayerTimes[tomorrowPrayersIndex][1];
    prayerName = prayerNames[0];
    return getNextPrayerLabel(prayerName, nextPrayerTimeStamp);
  }
  if (nextPrayerTimeStamp > nowTimeStamp) {
    // Display next prayer time
    return getNextPrayerLabel(prayerName, nextPrayerTimeStamp);
  }
  // Display time since start of current prayer
  const timeSincePrayer = nowTimeStamp - nextPrayerTimeStamp;
  const minutes = Math.round(timeSincePrayer / 60);
  return prayerName + " " + minutes + "'";
};

// TEST
if (process.env.quokka) {
  let date;

  // It should display the next prayer time
  date = new Date(2022, 6, 29, 12, 0);
  if (exports.getPrayerTimeLabel(date) !== `${prayerNames[2]} 13:45`) {
    console.log(exports.getPrayerTimeLabel(date));
    throw new Error("test failed");
  }

  // When current prayer is less than 30 minutes, it should display the time since start of current prayer
  date = new Date(2022, 6, 29, 14, 0);
  if (exports.getPrayerTimeLabel(date) !== `${prayerNames[2]} 15'`) {
    console.log(exports.getPrayerTimeLabel(date));
    throw new Error("test failed");
  }

  // When next prayer is tomorrow, it should display the next prayer time
  date = new Date(2022, 6, 29, 22, 50);
  if (exports.getPrayerTimeLabel(date) !== `${prayerNames[0]} 5:16`) {
    console.log(exports.getPrayerTimeLabel(date));
    throw new Error("test failed");
  }
}
