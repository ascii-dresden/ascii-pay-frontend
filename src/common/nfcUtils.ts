export function base64ToHex(str: string): string {
  const raw = window.atob(str);
  let result = "";
  for (let i = 0; i < raw.length; i++) {
    const hex = raw.charCodeAt(i).toString(16);
    result += hex.length === 2 ? hex : "0" + hex;
    result += " ";
  }
  return result.toUpperCase();
}
