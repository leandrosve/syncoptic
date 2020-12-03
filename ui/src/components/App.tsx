import CssBaseline from "@material-ui/core/CssBaseline";
import { MuiThemeProvider } from "@material-ui/core/styles";
import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "../assets/App.css";
import useCurrentTheme from "../hooks/useCurrentTheme";
import Editor from "./editor/Editor";
import Navbar from "./layout/Navbar";
import Watch from "./watch/Watch";
import Welcome from "./Welcome";

function App() {
  const { theme, switchTheme, themeName } = useCurrentTheme();

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline>
        <div className="App">
          <Router>
            <Navbar theme={themeName} switchTheme={switchTheme} />
       
              <Switch>
                <Route path="/" exact component={Welcome}></Route>
                <Route path="/create" exact component={Editor} />
                <Route path="/watch" exact component={Watch} />
              </Switch>
         
          </Router>
        </div>
      </CssBaseline>
    </MuiThemeProvider>
  );
}

export default App;
