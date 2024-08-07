export function subStrMatch(str, lookupStr) {
  if (str == "" || lookupStr == "") {
    return false;
  }

  str = str.toLowerCase();
  const lookupStrSplit = lookupStr.toLowerCase().trim().split(/\W+/);

  return lookupStrSplit.every((lookupSubStr) => {
    return str.includes(lookupSubStr);
  });
}
