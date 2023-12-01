export const isMarketOpen = (pair: any) => {
  const nyDate = new Date().toLocaleString("en-US", {
    timeZone: "America/New_York",
  });

  const currentDateTime = new Date(nyDate);
  const currentDay = currentDateTime.getDay();
  const currentHour = currentDateTime.getHours();

  const isFridayAfter5pm = currentDay === 5 && currentHour >= 17;
  const isWeekendDay = currentDay === 6 || currentDay === 0;
  const isBeforeSunday5pm =
    currentDay !== 0 || (currentDay === 0 && currentHour < 17);

  if (pair === "XBT/USD") {
    return true;
  } else {
    return !(isFridayAfter5pm || (isWeekendDay && isBeforeSunday5pm));
  }
};
