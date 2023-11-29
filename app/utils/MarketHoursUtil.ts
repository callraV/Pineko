export const isMarketOpen = (pair: any) => {
  // Get current date and time in New York timezone
  const nyDate = new Date().toLocaleString("en-US", {
    timeZone: "America/New_York",
  });
  const currentDateTime = new Date(nyDate);

  // Check if today is Sunday (0) and current time is between 5:00 pm and 11:59:59 pm
  if (currentDateTime.getDay() === 0 && currentDateTime.getHours() >= 17) {
    return true;
  }

  // Check if today is Monday to Thursday (1-4) and current time is between 12:00 am and 5:00 pm
  if (
    pair === "XBT/USD" ||
    (currentDateTime.getDay() >= 1 &&
      currentDateTime.getDay() <= 4 &&
      currentDateTime.getHours() < 17)
  ) {
    return true; // Market is opem
  } else {
    return false; // Market is closed
  }
};
