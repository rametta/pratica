import { Maybe, nullable, Nothing } from './maybe'

export type Result<O, E> = {
  ap: <A>(r: Result<A, E>) => Result<A, E>
  map: <A>(cb: (arg: O) => A) => Result<A, E>
  mapErr: <A>(cb: (arg: E) => A) => Result<O, A>
  chain: <A>(cb: (arg: O) => Result<A, E>) => Result<A, E>
  chainErr: <A>(cb: (arg: E) => Result<O, A>) => Result<O, A>
  swap: () => Result<O, E>
  bimap: <A, B>(ok: (arg: O) => A, err: (arg: E) => B) => Result<A, B>
  cata: <A, B>(obj: {
    Ok: (arg: O) => A
    Err: (arg: E) => B
  }) => A | B
  toMaybe: () => Maybe<O>
  inspect: () => string
  isErr: () => boolean
  isOk: () => boolean
}


const innerOk = <O>(arg: O): Result<O, any> => ({
  ap: <A>(r: Result<A, any>) => typeof arg === 'function' ? r.map(x => arg(x)) : Err(),
  map: <A>(cb: (a: O) => A): Result<A, any> => innerOk(cb(arg)),
  mapErr: (): Result<O, any> => innerOk(arg),
  chain: <A>(cb: (a: O) => Result<A, any>): Result<A, any> => cb(arg),
  chainErr: () => innerOk(arg),
  swap: () => innerErr(arg),
  bimap: (ok, _) => innerOk(ok(arg)),
  cata: obj => obj.Ok(arg),
  toMaybe: () => nullable(arg),
  inspect: () => `Ok(${arg})`,
  isErr: () => false,
  isOk: () => true
})

const innerErr = <E>(arg: E): Result<any, E> => ({
  ap: () => innerErr(arg),
  map: () => innerErr(arg),
  mapErr: <A>(cb: (a: E) => A): Result<any, A> => innerErr(cb(arg)),
  chain: () => innerErr(arg),
  chainErr: cb => cb(arg),
  swap: () => innerOk(arg),
  bimap: (_, err) => innerErr(err(arg)),
  cata: obj => obj.Err(arg),
  toMaybe: () => Nothing,
  inspect: () => `Err(${arg})`,
  isErr: () => true,
  isOk: () => false
})

export function Ok(): Result<any, any>
export function Ok<O>(arg: O): Result<O, any>
export function Ok<O>(arg?: O): Result<O | undefined, any> {
  return innerOk(arg)
}

export function Err(): Result<any, any>
export function Err<E>(arg: E): Result<any, E>
export function Err<E>(arg?: E): Result<any, E | undefined> {
  return innerErr(arg)
}
