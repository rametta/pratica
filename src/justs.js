// justs: takes an array of maybes and filters out any non-just types
export const justs = (arr = []) => arr.filter(a => a.isJust && a.isJust())