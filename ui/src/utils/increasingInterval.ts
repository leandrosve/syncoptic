const increasingInterval = (fn:()=>boolean | Promise<boolean>, time:number, increment:(previousValue:number)=>number):void =>{
  
 let stop = false;
  
  const next = async (i:number)=> {
    stop= await fn();
    console.log({stop});
    if(!stop) setTimeout(next, i, increment(i));
  }
  setTimeout(next, time, time);
}


export default increasingInterval;