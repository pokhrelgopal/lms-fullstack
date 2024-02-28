export default function convertToTimeAgo(timestamp: string): string {
  const currentDate = new Date();
  const parsedTimestamp = new Date(timestamp);

  const secondsAgo = Math.floor(
    (currentDate.getTime() - parsedTimestamp.getTime()) / 1000
  );

  if (secondsAgo < 60) {
    return `${secondsAgo} second${secondsAgo === 1 ? "" : "s"} ago`;
  }

  const minutesAgo = Math.floor(secondsAgo / 60);
  if (minutesAgo < 60) {
    return `${minutesAgo} minute${minutesAgo === 1 ? "" : "s"} ago`;
  }

  const hoursAgo = Math.floor(minutesAgo / 60);
  if (hoursAgo < 24) {
    return `${hoursAgo} hour${hoursAgo === 1 ? "" : "s"} ago`;
  }

  const daysAgo = Math.floor(hoursAgo / 24);
  if (daysAgo < 7) {
    return `${daysAgo} day${daysAgo === 1 ? "" : "s"} ago`;
  }

  const weeksAgo = Math.floor(daysAgo / 7);
  if (weeksAgo < 4) {
    return `${weeksAgo} week${weeksAgo === 1 ? "" : "s"} ago`;
  }

  const monthsAgo = Math.floor(daysAgo / 30);
  return `${monthsAgo} month${monthsAgo === 1 ? "" : "s"} ago`;
}
