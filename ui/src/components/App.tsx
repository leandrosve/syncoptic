import React, { useRef, useState } from "react";
import "../App.css";
import YouTube from "react-youtube";
import useYoutubeVideo from "../hooks/useYoutubeVideo";
import { Grid, IconButton } from "@material-ui/core";
import Controls from "./controls/Controls";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import SwapHorizIcon from "@material-ui/icons/SwapHoriz";
import YoutubeContainer from "./YouTubeContainer";

const darkTheme = createMuiTheme({
  palette: {
    primary: {
      main: "#d80202",
    },
    background:{
      default:"#181818"
    },
    type: "dark",
  },
});

/*
const lightTheme = createMuiTheme({
  palette: {
    primary: {
      main: "#d80202",
    },
    background:{
      default:"#f9f9f9"
    },

    type: "light",
  },
});
*/

function App() {
  const reactionRef = useRef<YouTube>(null);

  const reactionPlayer = useYoutubeVideo(reactionRef);

  const originalRef = useRef<YouTube>(null);

  const originalPlayer = useYoutubeVideo(originalRef);

  const [direction, setDirection] = useState<"row" | "row-reverse">("row");
  const switchPositions = () => {
    setDirection((prev) => {
      if (prev === "row") return "row-reverse";
      return "row";
    });
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline>
        <div className="App">
          <Grid container spacing={3} style={{ flexDirection: direction }}>
            <Grid item xs={6}>
              <h2>Reaction</h2>
                <YoutubeContainer
                  videoId="QVv2XWOttIA"          
                  playerRef={reactionRef}
                />
            </Grid>
            <Grid item xs={6}>
              <h2>Original</h2>
                <YoutubeContainer
                  videoId="XduXpTx24hY"
                  playerRef={originalRef}
                />
            </Grid>
          </Grid>
          <IconButton onClick={switchPositions}>
            <SwapHorizIcon />
          </IconButton>
          <div style={{ width: "80%" }}>
            <Controls
              reactionPlayer={reactionPlayer}
              originalPlayer={originalPlayer}
            />
          </div>
        </div>
      </CssBaseline>
    </ThemeProvider>
  );
}

export default App;
