import { Err, Ok, Result } from "./result"
import { Just, Maybe, Nothing } from "./maybe"

export const collectResult = <O, E>(results: Array<Result<O, E>>): Result<Array<O>, Array<E>> => {
  const successes: Array<O> = []
  const failures: Array<E> = []

  for (const result of results) {
    if (result.isOk()) {
      successes.push(result.value() as O)
    } else {
      failures.push(result.value() as E)
    }
  }

  if (failures.length > 0) {
    return Err(failures)
  }
  return Ok(successes)
}

export const collectMaybe = <O>(maybes: Array<Maybe<O>>): Maybe<Array<O>> => {
  const values: Array<O> = []

  for (const maybe of maybes) {
    if (maybe.isNothing()) {
      return Nothing
    }
    values.push(maybe.value() as O)
  }

  return Just(values)
}
