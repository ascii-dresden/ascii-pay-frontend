function stringToColor(name: string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < name.length; i += 1) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

export function stringAvatar(name: string) {
  const split = name.split(" ");
  if (split.length < 2 || split[0].length < 1 || split[1].length < 1) {
    return {
      sx: {
        bgcolor: stringToColor(name),
      },
      children: `${name.length < 1 ? "" : name[0]}`,
    };
  }

  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${split[0][0]}${name.split(" ")[1][0]}`,
  };
}

export function stringWithoutColorAvatar(name: string) {
  const split = name.split(" ");
  if (split.length < 2 || split[0].length < 1 || split[1].length < 1) {
    return {
      children: `${name.length < 1 ? "" : name[0]}`,
    };
  }

  return {
    children: `${split[0][0]}${name.split(" ")[1][0]}`,
  };
}
