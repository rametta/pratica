type Maybe<A> = {
  ap: <B>(cb: () => B) => Maybe<B>
  map: <B>(cb: (arg: A) => B) => Maybe<B>
  chain: <B>(cb: (arg: A) => B) => Maybe<B>
  default: <B>(cb: () => B) => Maybe<B>
  cata: <B, C>(obj: {
    Just: (arg: A) => B
    Nothing: () => C
  }) => B|C
  inspect: () => string
  isNothing: () => boolean
  isJust: () => boolean
}

export type Nothing = Maybe<any>
export function Maybe<A>(arg: A): Maybe<A>
export function Just<A>(arg: A): Maybe<A>
export function head<A>(arr: A[]): Maybe<A>
export function tail<A>(arr: A[]): Maybe<A>
export function last<A>(arr: A[]): Maybe<A>
export function parseDate(date: string): Maybe<Date>
export function get<A>(selector: (String|Number)[]): (data: any) => Maybe<A>
export function tryFind<A>(selector: any[]): (data: A[]) => Maybe<A>
export function justs<A>(arr: any[]): Maybe<A>[]
export function encase<A>(throwableFunc: () => A): Maybe<A>