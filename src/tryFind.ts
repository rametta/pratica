import { nullable, Maybe } from './maybe'

export const tryFind = <A>(exp: (a: A) => boolean) => (data: A[]): Maybe<A> =>
  nullable(data.find(exp))