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
  amber: { light: amber[400], dark: amber[900] },
  blue: { light: blue[400], dark: blue[900] },
  brown: { light: brown[400], dark: brown[900] },
  cyan: { light: cyan[400], dark: cyan[900] },
  deepOrange: { light: deepOrange[400], dark: deepOrange[900] },
  deepPurple: { light: deepPurple[400], dark: deepPurple[900] },
  green: { light: green[400], dark: green[900] },
  grey: { light: grey[400], dark: grey[900] },
  indigo: { light: indigo[400], dark: indigo[900] },
  lightBlue: { light: lightBlue[400], dark: lightBlue[900] },
  lightGreen: { light: lightGreen[400], dark: lightGreen[900] },
  lime: { light: lime[400], dark: lime[900] },
  orange: { light: orange[400], dark: orange[900] },
  pink: { light: pink[400], dark: pink[900] },
  purple: { light: purple[400], dark: purple[900] },
  red: { light: red[400], dark: red[900] },
  teal: { light: teal[400], dark: teal[900] },
  yellow: { light: yellow[400], dark: yellow[900] },
};

export function getStatusColors(): string[] {
  return Object.keys(StatusColors);
}

export function getStatusColor(color: string, theme: "light" | "dark"): string {
  if (color in StatusColors) {
    return theme === "light"
      ? StatusColors[color].light
      : StatusColors[color].light;
  }

  return "#ff00ff";
}
