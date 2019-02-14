import { Just, Nothing } from './maybe'
import { Err, Ok } from './result';

const isFunc = func => !!(func && func.constructor && func.call && func.apply)

export const encase = func => {
  if (!isFunc(func)) {
    return Nothing
  }

  try {
    const res = func()
    return Just(res)
  } catch {
    return Nothing
  }
}

export const encaseRes = func => {
  if (!isFunc(func)) {
    return Err('Not a function')
  }

  try {
    const res = func()
    return Ok(res)
  } catch(e) {
    return Err(e)
  }
}