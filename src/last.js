import { Just, Nothing } from './maybe'

export const last = arr => arr.length ? Just(arr[arr.length - 1]) : Nothing