import { Result, Ok, Err } from './result'

export type Maybe<A> = {
  ap: <B>(m: Maybe<any>) => Maybe<B>
  map: <B>(cb: (arg: A) => B) => Maybe<B>
  chain: <B>(cb: (arg: A) => Maybe<B>) => Maybe<B>
  alt: <B>(value: B) => Maybe<A | B>
  cata: <B, C>(obj: {
    Just: (arg: A) => B
    Nothing: () => C
  }) => B|C
  toResult: () => Result<any, any>
  inspect: () => string
  isNothing: () => boolean
  isJust: () => boolean,
  get: () => A | undefined
}

export const Just = <A>(arg: A): Maybe<A> => ({
  ap: <B>(m: Maybe<B>): Maybe<B> => typeof arg === 'function' ? m.map(v => arg(v)) : Nothing,
  map: <B>(cb: (a: A) => B): Maybe<B> => Just(cb(arg)),
  chain: <B>(cb: (a: A) => Maybe<B>): Maybe<B> => cb(arg),
  alt: () => Just(arg),
  cata: obj => obj.Just(arg),
  toResult: () => Ok(arg),
  inspect: () => `Just(${arg})`,
  isNothing: () => false,
  isJust: () => true,
  get: () => arg === null || arg === undefined ? undefined : arg
})

export const Nothing: Maybe<any> = ({
  ap: (): Maybe<any> => Nothing,
  map: (): Maybe<any> => Nothing,
  chain: (): Maybe<any> => Nothing,
  alt: a => Just(a),
  cata: obj => obj.Nothing(),
  toResult: () => Err(),
  inspect: () => `Nothing`,
  isNothing: () => true,
  isJust: () => false,
  get: () => undefined
})

export const nullable = <T>(arg?: T): Maybe<NonNullable<T>> =>
  arg === null || arg === undefined
    ? Nothing
    : Just(arg)
