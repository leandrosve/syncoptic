import { useEffect, useState } from "react";


const defaultBackgroundSrc =
  "https://png.pngtree.com/thumb_back/fw800/background/20190223/ourmid/pngtree-purple-light-effect-electronic-technology-background-backgrounddatabusinessblueelectronictechnologyintelligentblue-backgroundtechnology-backgroundlightcool-image_78722.jpg";


const getRandomInt = (max: number) => {
  return Math.floor(Math.random() * Math.floor(max));
};

const useRandomThumbnail = (videoId1?: string, videoId2?: string) => {
  const [url, setUrl] = useState<string>("");
 
  useEffect(() => {
    if((!videoId1 || videoId1==="")){
      setUrl(defaultBackgroundSrc);
      return;
    }
    let id: string = videoId1 || "";
    if (videoId2) {
      if (getRandomInt(2) === 1) {
          id = videoId2
        };
    }
    let rand: string = getRandomInt(4).toString();
    if (rand === "0") rand = "default";

    setUrl(`https://i.ytimg.com/vi_webp/${id}/maxres${rand}.webp`);
    
  }, [videoId1, videoId2]);

  return url;
};

export default useRandomThumbnail;
