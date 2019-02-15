import { Just, Nothing } from './maybe'

export const head = arr => arr.length ? Just(arr[0]) : Nothing