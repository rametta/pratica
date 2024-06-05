import { Result } from "./result"

// oks: takes an array of Results and filters out any non-ok types
export const oks = <A>(arr: Result<A, any>[] = []): Result<A, any>[] => arr.filter((a) => a.isOk())
