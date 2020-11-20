export enum PointState {
  NOT_FOUND = -1,
  UNSTARTED = -2,
  PAUSED= -3
}

export default class SyncMap extends Map<number, number> {
    
  public getFirstValue() {
    return this.values().next().value
  }
  public findCurrentSyncPoint(time: number): number {
    let prev: number = PointState.NOT_FOUND;
    for (const key of this.keys()) {
      if (key < time) prev = key;
      else break;
    }
    return prev;
  }

  public findOriginalTime(reactionTime: number) {
    console.log("time", reactionTime);
    const key = this.findCurrentSyncPoint(reactionTime);
    console.log("key", key)
    if (key === PointState.NOT_FOUND) return PointState.UNSTARTED;
    const originalTimePoint = this.get(key) || 0;
    console.log("originalTimePoint", originalTimePoint);
    if(originalTimePoint < 0 ) return originalTimePoint;
    const offset = reactionTime - key;
    console.log("offset", offset);
    return originalTimePoint + offset;
  }
}
