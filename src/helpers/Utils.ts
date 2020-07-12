import path = require("path");

export const importPrefix = (value: string) => {
  const length = value.split(/[\\\/]/g).length;
  const r: string[] = [];
  for (let index = 0; index < length; index++) {
    r.push("..");
  }
  return r.join("/");
};
