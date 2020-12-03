import {
  AppBar,
  Button,
  IconButton,
  makeStyles,
  Toolbar,
  Typography,
  useMediaQuery,
} from "@material-ui/core";
import React, { FunctionComponent } from "react";
import MenuIcon from "@material-ui/icons/Menu";
import PersonIcon from "@material-ui/icons/Person";
import ThemeSwitch from "./ThemeSwitch";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,

    color: theme.palette.text.primary,
  },
  menuButton: {
    marginRight: theme.spacing(1),
  },
  title: {
    flexGrow: 1,
    display: "inline-flex",
    flexDirection:"row",
    alignItems:"center",
    justifyContent: "start",
  },
}));

interface Props{
  theme:string,
  switchTheme:Function
}

const Navbar: FunctionComponent<Props> = ({theme, switchTheme}) => {
  const classes = useStyles();

  const isMobile = useMediaQuery('(max-width:600px)');

  return (
    <AppBar position="static" className={classes.root}>
      <Toolbar>
        <IconButton
          edge="start"
          className={classes.menuButton}
          color="inherit"
          aria-label="menu"
        >
          <MenuIcon />
        </IconButton>
        
        <div className={classes.title}>
        
        <Link to="/" className={classes.title}>
        <img src='/logo330.png' style={{height:"48px", marginRight:"-5px", display:"inline-block"}}/>
        
        <Typography variant="h6" >
        
          yncoptic
        </Typography>
        </Link>
       
        </div>
       
        {
          !isMobile && <div>
            <Link to="/watch"><Button>Watch</Button></Link>
          <Link to="/create"><Button>Create</Button></Link>
          <ThemeSwitch theme={theme} switchTheme={switchTheme}/>
          <Button startIcon={<PersonIcon />} color="inherit">
            Login
          </Button>
        </div>
        }
        
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
