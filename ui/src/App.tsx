import React, { useRef, useState } from "react";
import "./App.css";
import YouTube, { Options } from "react-youtube";
import useYoutubeVideo from "./hooks/useYoutubeVideo";
import { colors, Grid, IconButton} from "@material-ui/core";
import Controls from "./components/Controls";
import { createMuiTheme, makeStyles, ThemeProvider, withStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import SwapHorizIcon from "@material-ui/icons/SwapHoriz";

const darkTheme = createMuiTheme({
  palette: {
    primary: {
      main: "#d80202",
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
                <YouTube videoId="QVv2XWOttIA" ref={reactionRef} />
            </Grid>
            <Grid item xs={6}>
              <h2>Original</h2>
              <YouTube videoId="XduXpTx24hY" ref={originalRef}/>
            </Grid>
          </Grid>
          <IconButton onClick={switchPositions}>
            <SwapHorizIcon />
          </IconButton>
          <div style={{ width: "80%" }}>
            <Controls reactionPlayer={reactionPlayer} originalPlayer={originalPlayer}/>
          </div>
        </div>
      </CssBaseline>
    </ThemeProvider>
  );
}

export default App;
