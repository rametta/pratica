import { Maybe, nullable } from "./maybe"

export const get =
  <A>(selector: (string | number)[]) =>
  (data: any): Maybe<A> =>
    selector.reduce((acc, s) => acc.chain((d) => nullable(d[s])), nullable(data))
