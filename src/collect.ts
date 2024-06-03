import { Err, Ok, Result } from "./result"
import { Just, Maybe, Nothing } from "./maybe"

declare global {
  interface Array<T> {
    collect:{
      /**
       * Collects an array of results into a result of an array.
       * If all results are Ok, returns an Ok with an array of values.
       * If any result is an Err, returns an Err with an array of errors.
       */
      <O, E>(this: Array<Result<O, E>>): Result<Array<O>, Array<E>>
      /**
       * Collects an array of maybes into a maybe of an array.
       * If all maybes are Just, returns a Just with an array of values.
       * If any maybe is a Nothing, returns a Nothing.
       */
      <O>(this: Array<Maybe<O>>): Maybe<Array<O>>
    }
  }
}

Array.prototype.collect = function <O, E>(this: any): any {
  const isResult = typeof this[0] === 'object' && this[0].hasOwnProperty('isOk')
  if (isResult) {
    return collectResult(this as Array<Result<O, E>>) as Result<Array<O>, Array<E>>
  }else {
    return collectMaybe(this as Array<Maybe<O>>) as Maybe<Array<O>>
  }
}

function collectResult<O, E>(results: Array<Result<O, E>>): Result<Array<O>, Array<E>> {
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

function collectMaybe<O>(maybes: Array<Maybe<O>>): Maybe<Array<O>> {
  const values: Array<O> = []

  for (const maybe of maybes) {
    if (maybe.isNothing()) {
      return Nothing
    }
    values.push(maybe.value() as O)
  }

  return Just(values)
}

export {}
