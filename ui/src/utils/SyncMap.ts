export enum PointState {
  NOT_FOUND = -1,
  UNSTARTED = -2,
  PAUSED= -3
}

export default class SyncMap extends Map<number, number> {
    
  public findSyncPoint(time: number): [number, number] | undefined {
    let prev: [number, number] | undefined = undefined;
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
    let timeout = nextKey ? nextKey - time : -1;
    console.log({nextKey, timeout});

    return {key: nextKey, timeout};
  }

  public findOriginalTime(reactionTime: number) {
    const currentSyncPoint = this.findSyncPoint(reactionTime);
    console.log({currentSyncPoint});
    if(!currentSyncPoint) return PointState.NOT_FOUND;
    const [key, value] = currentSyncPoint;
    if(value < 0) return value;
    const offset = reactionTime - key;
    return value + offset;
  }
  
}
