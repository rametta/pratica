import { Maybe } from './maybe'

export const get = selector => data =>
  Maybe(selector.reduce((acc, s) => acc && acc[s] !== undefined ? acc[s] : null, data))