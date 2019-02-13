import { Maybe, Nothing, Just } from './maybe'

export const parseDate = date =>
  Maybe(date)
    .map(d => new Date(d))
    .chain(d => isNaN(d.valueOf()) ? Nothing : Just(d))