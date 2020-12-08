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
  return `${minutes.padEnd(2, "0")}:${seconds.padEnd(2, "0")}:${ms.padEnd(3, "0")}`;
}

const parseToNumber = (val:string)=>{
  let minutes = parseInt(val.substring(0, 2));
  let seconds = parseInt(val.substring(3, 5));
  let ms = parseInt(val.substring(6, 9));

  return  minutes * 60 + seconds + ms * 0.001 ;

}
export default formatTimeInput;
export {parseToNumber};