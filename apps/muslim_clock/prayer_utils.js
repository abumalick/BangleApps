const prayerNames = ["Fajr", "Churuk", "Dhor", "Asr", "Maghreb", "'Icha"];

const prayerTimes = [
  [1661641200, 20460, 25920, 49200, 62040, 72360, 77160],
  [1661727600, 20520, 25980, 49200, 61980, 72240, 77100],
  [1661814000, 20580, 25980, 49200, 61980, 72180, 77040],
  [1661900400, 20640, 26040, 49140, 61920, 72120, 76920],
  [1661986800, 20640, 26100, 49140, 61920, 72060, 76860],
  [1662073200, 20700, 26100, 49140, 61860, 72000, 76800],
  [1662159600, 20760, 26160, 49080, 61800, 71880, 76680],
  [1662246000, 20820, 26160, 49080, 61800, 71820, 76620],
  [1662332400, 20820, 26220, 49080, 61740, 71760, 76500],
  [1662418800, 20880, 26220, 49020, 61740, 71700, 76440],
  [1662505200, 20940, 26280, 49020, 61680, 71640, 76380],
  [1662591600, 20940, 26280, 49020, 61620, 71520, 76260],
  [1662678000, 21000, 26340, 48960, 61620, 71460, 76200],
  [1662764400, 21060, 26400, 48960, 61560, 71400, 76140],
  [1662850800, 21120, 26400, 48960, 61500, 71340, 76020],
  [1662937200, 21120, 26460, 48900, 61500, 71220, 75960],
  [1663023600, 21180, 26460, 48900, 61440, 71160, 75840],
  [1663110000, 21240, 26520, 48900, 61380, 71100, 75780],
  [1663196400, 21240, 26520, 48840, 61380, 71040, 75720],
  [1663282800, 21300, 26580, 48840, 61320, 70920, 75600],
  [1663369200, 21360, 26580, 48780, 61260, 70860, 75540],
  [1663455600, 21360, 26640, 48780, 61200, 70800, 75480],
  [1663542000, 21420, 26700, 48780, 61200, 70740, 75360],
  [1663628400, 21480, 26700, 48720, 61140, 70620, 75300],
  [1663714800, 21480, 26760, 48720, 61080, 70560, 75240],
  [1663801200, 21540, 26760, 48720, 61020, 70500, 75120],
  [1663887600, 21600, 26820, 48660, 61020, 70380, 75060],
  [1663974000, 21600, 26820, 48660, 60960, 70320, 75000],
  [1664060400, 21660, 26880, 48660, 60900, 70260, 74880],
  [1664146800, 21660, 26880, 48600, 60840, 70200, 74820],
  [1664233200, 21720, 26940, 48600, 60780, 70080, 74760],
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
