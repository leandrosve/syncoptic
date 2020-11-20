const increasingInterval = (fn:()=>boolean, time:number, increment:(previousValue:number)=>number):void =>{
  
 let cont = true;
  
  const next = (i:number)=> {
    cont= fn();
    if(cont) setTimeout(next, i, increment(i));
  }
  
  setTimeout(next, time, time);
}


export default increasingInterval;