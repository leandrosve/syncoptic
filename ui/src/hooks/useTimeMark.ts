import { useCallback, useEffect, useState } from "react";

const useTimeMark = (player: YT.Player | undefined, active: boolean, forceUpdate?:number) => {
  const [timeMarker, setTimeMarker] = useState<number>(0);

  const updateTimeMark = useCallback(async () => {
    const t = await player?.getCurrentTime();
    setTimeMarker(t || 0);
    return t;
  }, [setTimeMarker, player]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (player && active) {
      interval = setInterval(async () => {
        //updateTimeMark();
        setTimeMarker(prev => prev + 1)
      }, 1000);
    }
    return () => {
      clearInterval(interval);
    };
  }, [player, active, updateTimeMark]);

  useEffect(()=>{
    player?.addEventListener("onStateChange", updateTimeMark);
  },[player, updateTimeMark])

  useEffect(()=>{
    if(forceUpdate) setTimeMarker(forceUpdate);
    else{
      updateTimeMark();
    }
  },[setTimeMarker, forceUpdate, updateTimeMark])

  return timeMarker;
};

export default useTimeMark;
