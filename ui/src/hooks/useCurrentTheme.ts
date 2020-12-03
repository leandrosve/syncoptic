import { Theme } from "@material-ui/core";
import { useCallback, useEffect, useState } from "react";
import { darkTheme, lightTheme } from "../assets/themes";

const useCurrentTheme = () => {
  const [theme, setTheme] = useState<Theme>(lightTheme);
  const [themeName, setThemeName] = useState<"light" | "dark">("light");
  const switchTheme = useCallback(() => {
    setThemeName((prev) => {
      setTheme(prev === "dark" ? {...lightTheme} : {...darkTheme});
      const t = prev === "dark" ? "light" : "dark";
      localStorage.setItem("theme", t);
      return t;
    });
  }, [setTheme, setThemeName]);

  useEffect(() => {
    const t = localStorage.getItem("theme");
    if (t && t === "dark") {
      setTheme(darkTheme);
      setThemeName("dark");
    }
  }, [setTheme, setThemeName]);

  return {
    theme,
    themeName,
    switchTheme,
  };
};

export default useCurrentTheme;
