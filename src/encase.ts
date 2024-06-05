import { Maybe, Just, Nothing } from "./maybe"
import { Result, Err, Ok } from "./result"

export const encase = <A>(func: () => A): Maybe<A> => {
  try {
    return Just(func())
  } catch {
    return Nothing
  }
}

export const encaseRes = <A, E>(func: () => A): Result<A, E> => {
  try {
    return Ok<A>(func())
  } catch (e) {
    return Err<E>(e)
  }
}
