import { Maybe, Just, Nothing } from './maybe'

export const tail = <A>(arr: A[]): Maybe<A> => arr.length
  ? Just(arr.slice(1))
  : Nothing