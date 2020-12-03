import { Typography } from "@material-ui/core";
import React from "react";
import BackgroundImage from "./layout/BackgroundImage";
const backgroundSrc =
  "https://png.pngtree.com/thumb_back/fw800/background/20190223/ourmid/pngtree-purple-light-effect-electronic-technology-background-backgrounddatabusinessblueelectronictechnologyintelligentblue-backgroundtechnology-backgroundlightcool-image_78722.jpg";

const Welcome = () => {
  return (
    <div className="flexVertical" style={{width:"100%"}}>
      <BackgroundImage src={backgroundSrc} />
      <div>
      <img src="/logo330.png" style={{ height: "200px", width:"200px" , marginTop:"50px"}}  alt="brand"/>
      </div>
      <Typography variant="h3">Syncoptic</Typography>
    </div>
  );
};

export default Welcome;
