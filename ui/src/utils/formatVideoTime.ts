import moment from "moment";
const formatTime = (time: number | string | undefined): string => {
  if (time === null || time ===undefined || time < 0) return "0:00";
  const duration = moment.duration(time, "s");
  const minutes = duration.minutes().toString().padStart(2,"0");
  const seconds = duration.seconds();
  const ms = duration.milliseconds();
  const formatedMs=ms.toFixed(0).padStart(3, "0");
  return `${minutes}:${seconds < 10 ? 0 : ""}${duration.seconds()}:${formatedMs}`;
};

export default formatTime;
