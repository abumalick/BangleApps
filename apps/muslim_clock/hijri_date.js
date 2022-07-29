// https://github.com/abdennour/hijri-date/blob/master/src/DateConverter.js
function intPart(floatNum) {
  if (floatNum < -0.0000001) {
    return Math.ceil(floatNum - 0.0000001);
  }
  return Math.floor(floatNum + 0.0000001);
}
var delta = 1;

// https://github.com/abdennour/hijri-date/blob/master/src/DateConverter.js
function gregToIsl(d, m, y) {
  let jd,
    l,
    jd1,
    n,
    j,
    delta = 1;
  if (y > 1582 || (y == 1582 && m > 10) || (y == 1582 && m == 10 && d > 14)) {
    //added delta=1 on jd to comply isna rulling 2007
    jd =
      intPart((1461 * (y + 4800 + intPart((m - 14) / 12))) / 4) +
      intPart((367 * (m - 2 - 12 * intPart((m - 14) / 12))) / 12) -
      intPart((3 * intPart((y + 4900 + intPart((m - 14) / 12)) / 100)) / 4) +
      d -
      32075 +
      delta;
  } else {
    //added +1 on jd to comply isna rulling
    jd =
      367 * y -
      intPart((7 * (y + 5001 + intPart((m - 9) / 7))) / 4) +
      intPart((275 * m) / 9) +
      d +
      1729777 +
      delta;
  }

  //added -1 on jd1 to comply isna rulling
  jd1 = jd - delta;
  l = jd - 1948440 + 10632;
  n = intPart((l - 1) / 10631);
  l = l - 10631 * n + 354;
  j =
    intPart((10985 - l) / 5316) * intPart((50 * l) / 17719) +
    intPart(l / 5670) * intPart((43 * l) / 15238);
  l =
    l -
    intPart((30 - j) / 15) * intPart((17719 * j) / 50) -
    intPart(j / 16) * intPart((15238 * j) / 43) +
    29;
  m = intPart((24 * l) / 709);
  d = l - intPart((709 * m) / 24);
  y = 30 * n + j - 30;

  return {
    d,
    m,
    y,
  };
}

const shortMonthNames = [
  "Muha",
  "Saf",
  "Rab1",
  "Rab2",
  "Jumd1",
  "Jumd2",
  "Rajb",
  "Shbn",
  "Rmdn",
  "Shwl",
  "Qada",
  "Hija",
];
const monthNames = [
  "Muharram",
  "Safar",
  "Rabi'ul Awwal",
  "Rabi'ul Akhir",
  "Jumadal Ula",
  "Jumadal Akhira",
  "Rajab",
  "Sha'ban",
  "Ramadan",
  "Shawwal",
  "Dhul Qa'ada",
  "Dhul Hijja",
];

module.exports.getHijriDateLabel = (date) => {
  const hijriDate = gregToIsl(
    date.getDate(),
    date.getMonth() + 1,
    date.getFullYear()
  );
  return hijriDate.d + " " + monthNames[hijriDate.m - 1] + " " + hijriDate.y;
};
