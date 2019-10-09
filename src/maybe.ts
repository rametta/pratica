export type Maybe<A> = {
  ap: <B>(m: Maybe<any>) => Maybe<B>
  map: <B>(cb: (arg: A) => B) => Maybe<B>
  chain: <B>(cb: (arg: A) => Maybe<B>) => Maybe<B>
  alt: <B>(value: B) => Maybe<A | B>
  cata: <B, C>(obj: {
    Just: (arg: A) => B
    Nothing: () => C
  }) => B|C
  inspect: () => string
  isNothing: () => boolean
  isJust: () => boolean
}

export const Just = <A>(arg: A): Maybe<A> => ({
  ap: <B>(m: Maybe<B>): Maybe<B> => typeof arg === 'function' ? m.map(v => arg(v)) : Nothing,
  map: <B>(cb: (a: A) => B): Maybe<B> => Just(cb(arg)),
  chain: <B>(cb: (a: A) => Maybe<B>): Maybe<B> => cb(arg),
  alt: () => Just(arg),
  cata: obj => obj.Just(arg),
  inspect: () => `Just(${arg})`,
  isNothing: () => false,
  isJust: () => true
})

export const Nothing: Maybe<any> = ({
  ap: (): Maybe<any> => Nothing,
  map: (): Maybe<any> => Nothing,
  chain: (): Maybe<any> => Nothing,
  alt: a => Just(a),
  cata: obj => obj.Nothing(),
  inspect: () => `Nothing`,
  isNothing: () => true,
  isJust: () => false
})

export const nullable = <T>(arg?: T): Maybe<NonNullable<T>> =>
  arg === null || arg === undefined
    ? Nothing
    : Just(arg)

// const rando = () =>
//   Math.random() >= .5
//     ? 5
//     : null

// const y = nullable(rando())
//   .map(x => x * 8)
//   .map(x => false)
//   .map(x => x ? 'hello' : 'goodbye')
//   .map(x => x + ' jason')
//   .chain<number>(x => x.length > 4 ? Just(x.length) : Nothing)
//   .map(x => x)
//   .chain(x => nullable(rando()))
//   .alt('fg')
//   .map(x => x)
//   .cata({
//     Just: x => x,
//     Nothing: () => false
//   })

// // const z = Just((x: number) => (y: number): number => x + y)
// //   .map2(Just(4), Just(4))
// //   .map(x => x)

// const u = Just((x: number) => (y: number) => x + y)
//   .ap(Just(5))
//   .map(x => x)
