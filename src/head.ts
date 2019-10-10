import { Maybe, Just, Nothing } from './maybe'

export const head = <A>(arr: A[]): Maybe<A> => arr.length
  ? Just(arr[0])
  : Nothing