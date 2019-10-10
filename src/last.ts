import { Maybe, Just, Nothing } from './maybe'

export const last = <A>(arr: A[]): Maybe<A> => arr.length
  ? Just(arr[arr.length - 1])
  : Nothing