type Maybe<A> = {
  ap: <B>(cb: () => B) => Maybe<B>
  map: <B>(cb: (arg: A) => B) => Maybe<B>
  chain: <B>(cb: (arg: A) => B) => B
  default: <B>(cb: () => B) => Maybe<B>
  cata: <B, C>(obj: {
    Just: (arg: A) => B
    Nothing: () => C
  }) => B|C
  inspect: () => string
  isNothing: () => boolean
  isJust: () => boolean
}

type Result<Ok, Err> = {
  ap: <A>(cb: () => A) => Result<A, Err>
  map: <A>(cb: (arg: Ok) => A) => Result<A, Err>
  mapErr: <A>(cb: (arg: Err) => A) => Result<Ok, A>
  chain: <A>(cb: (arg: Ok) => A) => A
  chainErr: <A>(cb: (arg: Err) => A) => A
  swap: () => Result<Ok, Err>
  bimap: <A, B>(ok: (arg: Ok) => A, err: (arg: Err) => B) => Result<A, B>
  cata: <A, B>(obj: {
    Ok: (arg: Ok) => A
    Err: (arg: Err) => B
  }) => A|B
  inspect: () => string
  isErr: () => boolean
  isOk: () => boolean
}

export const Nothing: Maybe<any>
export function Maybe<A>(arg: A): Maybe<NonNullable<A>>
export function Just<A>(arg: A): Maybe<A>
export function head<A>(arr: A[]): Maybe<A>
export function tail<A>(arr: A[]): Maybe<A>
export function last<A>(arr: A[]): Maybe<A>
export function parseDate(date: string): Maybe<Date>
export function get<A>(selector: (String|Number)[]): (data: any) => Maybe<A>
export function tryFind<A>(selector: any[]): (data: A[]) => Maybe<A>
export function justs<A>(arr: any[]): Maybe<A>[]
export function encase<A>(throwableFunc: () => A): Maybe<A>
export function encaseRes<A, B>(throwableFunc: () => A): Result<A, B>
export function Ok<A, B>(arg: A): Result<A, B>
export function Err<A, B>(arg: B): Result<A, B>
export function oks<A>(arr: any[]): Result<A, A>[]