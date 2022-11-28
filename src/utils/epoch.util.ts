export function currentEpoch() {
  return Date.parse(new Date().toUTCString());
}
