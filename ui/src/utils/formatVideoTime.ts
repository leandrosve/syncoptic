import moment from "moment";
const formatTime = (time: number | string | undefined): string => {
  if (time === null || time ===undefined) return "0:00";
  const duration = moment.duration(time, "s");
  const seconds = duration.seconds();
  return `${duration.minutes()}:${seconds < 10 ? 0 : ""}${duration.seconds()}`;
};

export default formatTime;
