import {
  amber,
  blue,
  brown,
  cyan,
  deepOrange,
  deepPurple,
  green,
  grey,
  indigo,
  lightBlue,
  lightGreen,
  lime,
  orange,
  pink,
  purple,
  red,
  teal,
  yellow,
} from "@mui/material/colors";

const StatusColors: { [key: string]: { light: string; dark: string } } = {
  amber: { light: amber[400], dark: amber[700] },
  blue: { light: blue[400], dark: blue[700] },
  brown: { light: brown[400], dark: brown[700] },
  cyan: { light: cyan[400], dark: cyan[700] },
  deepOrange: { light: deepOrange[400], dark: deepOrange[700] },
  deepPurple: { light: deepPurple[400], dark: deepPurple[700] },
  green: { light: green[400], dark: green[700] },
  grey: { light: grey[400], dark: grey[700] },
  indigo: { light: indigo[400], dark: indigo[700] },
  lightBlue: { light: lightBlue[400], dark: lightBlue[700] },
  lightGreen: { light: lightGreen[400], dark: lightGreen[700] },
  lime: { light: lime[400], dark: lime[700] },
  orange: { light: orange[400], dark: orange[700] },
  pink: { light: pink[400], dark: pink[700] },
  purple: { light: purple[400], dark: purple[700] },
  red: { light: red[400], dark: red[700] },
  teal: { light: teal[400], dark: teal[700] },
  yellow: { light: yellow[400], dark: yellow[700] },
};

export function getStatusColors(): string[] {
  return Object.keys(StatusColors);
}

export function getStatusColor(color: string, theme: "light" | "dark"): string {
  if (color in StatusColors) {
    return theme === "light"
      ? StatusColors[color].light
      : StatusColors[color].dark;
  }

  return "#ff00ff";
}
