import { Maybe } from "./maybe"

// justs: takes an array of maybes and filters out any non-just types
export const justs = <A>(arr: Maybe<A>[] = []): Maybe<A>[] => arr.filter((a) => a.isJust())
