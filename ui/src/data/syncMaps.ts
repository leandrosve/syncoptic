import SyncMap, { PointState } from "../types/SyncMap";

const syncMap = new SyncMap([
  [170, { time: 0, state: PointState.PLAYING }],
  [185, { time: 0, state: PointState.PLAYING }],
  [189, { time: 17.5, state: PointState.PAUSED }],
  [235, { time: 17.5, state: PointState.PLAYING }],
  [252, { time: 24.6, state: PointState.PAUSED }],
  [254, { time: 24.6, state: PointState.PLAYING }],
  [341.5, { time: 112, state: PointState.PAUSED }],
  [343.7, { time: 112, state: PointState.PLAYING }],
]);

export {syncMap};