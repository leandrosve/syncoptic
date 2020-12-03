function limit(val: string, max: string) {
  if (val.length === 1 && val[0] > max[0]) {
    val = "0" + val;
  }

  if (val.length === 2) {
    if (Number(val) === 0) {
      val = "00";

      //this can happen when user paste number
    } else if (val > max) {
      val = max;
    }
  }

  return val;
}

function formatTimeInput(val: string) {
  let minutes = limit(val.substring(0, 2), "99");
  let seconds = limit(val.substring(2, 4), "59");
  let ms = limit(val.substring(4, 7), "999");

  return `${minutes}:${seconds.length ? seconds : "00"}:${
    ms.length ? ms : "000"
  }`;
}

export default formatTimeInput;
