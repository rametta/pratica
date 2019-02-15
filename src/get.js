import { Maybe } from './maybe'

export const get = selector => data =>
  Maybe(selector.reduce((acc, s) => acc && acc[s] ? acc[s] : null, data))