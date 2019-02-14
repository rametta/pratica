// oks: takes an array of Results and filters out any non-ok types
export const oks = (arr = []) => arr.filter(a => a.isOk && a.isOk())