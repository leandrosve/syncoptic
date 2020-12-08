export enum PointState {
  NOT_FOUND = -1,
  UNSTARTED = -2,
  PAUSED= -3,
  PLAYING= 0,
}

export type TimeInfo ={
  time:number,
  state:PointState,
}

export default class SyncMap extends Map<number, TimeInfo> {

  public addSyncPoint = (reactionTime:number, timeInfo:TimeInfo)=>{
    reactionTime=parseFloat(reactionTime.toFixed(3));
    this.set(reactionTime, timeInfo);
    return this;
  }

  public findSyncPoint(time: number): [number, TimeInfo] | undefined {
    let prev: [number, TimeInfo] | undefined = undefined;
    for (const point of this.entries()) {
      if (point[0] <= time) prev = point;
      else break;
    }
    return prev;
  }

  public findNextTimeout = (time:number) =>{
    const syncPoints = Array.from(this.entries());
    const nextKeyIndex = syncPoints.findIndex(
      ([key, val]) => key > time
    );
    if (nextKeyIndex < 0) return { key:PointState.NOT_FOUND, timeout:-1};
    const nextKey = syncPoints[nextKeyIndex]?.[0];
    let timeout = nextKey ? nextKey - time  : -1;
    console.log({nextKey, timeout});

    return {key: nextKey, timeout};
  }

  public findOriginalTime(reactionTime: number):TimeInfo {
    const currentSyncPoint = this.findSyncPoint(reactionTime);
    console.log({currentSyncPoint});
    if(!currentSyncPoint) return {time:PointState.NOT_FOUND, state:PointState.NOT_FOUND};
    const [key, value] = currentSyncPoint;
    if(value.state !== PointState.PLAYING) return value;
    const offset = reactionTime - key;
    return {time:value .time+ offset, state:value.state};
  }

  public getReactionTimes(){
    return Array.from(this.keys());
  }

  public getOriginalTimes(){
    return Array.from(this.values()).map(v=>v.time);
  }
  
  public getAsArray(){
    return Array.from(this);
  }
}
