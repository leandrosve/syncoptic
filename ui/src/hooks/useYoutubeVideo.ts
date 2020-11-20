import { RefObject, useEffect, useState } from "react";
import YouTube from "react-youtube";

const useYoutubeVideo = (playerRef: RefObject<YouTube> | undefined) => {
  const [player, setPlayer] = useState<YT.Player | undefined>();

  const setup = async (ref: RefObject<YouTube>) => {
    const p = await ref.current?.getInternalPlayer();
    setPlayer(p);
  };
  

  useEffect(() => {
    if (playerRef) setup(playerRef);
  }, [playerRef]);

  return player ;
};

export default useYoutubeVideo;
