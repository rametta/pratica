import { Just, Nothing } from './maybe'

export const tail = arr => arr.length ? Just(arr.slice(1)) : Nothing