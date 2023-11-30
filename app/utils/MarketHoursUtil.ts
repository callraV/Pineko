export const isMarketOpen = (pair: any) => {
  const nyDate = new Date().toLocaleString("en-US", {
    timeZone: "America/New_York",
  });
  const currentDateTime = new Date(nyDate);

  const currentDay = currentDateTime.getDay();
  const currentHour = currentDateTime.getHours();

  // Check if the current day is Friday (5) and the time is after 5pm
  const isFridayAfter5pm = currentDay === 5 && currentHour >= 17;

  // Check if the current day is Saturday (6) or Sunday (0)
  const isWeekendDay = currentDay === 6 || currentDay === 0;

  // Check if the current time is before 5pm on Sunday
  const isBeforeSunday5pm =
    currentDay !== 0 || (currentDay === 0 && currentHour < 17);

  if (pair === "XBT/USD") {
    return true;
  } else {
    return !(isFridayAfter5pm || (isWeekendDay && isBeforeSunday5pm));
  }
};
