import { nullable, Maybe, Nothing, Just } from './maybe'

export const parseDate = (date: any): Maybe<Date> =>
  nullable(date)
    .map(d => new Date(d))
    .chain(d => isNaN(d.valueOf()) ? Nothing : Just(d))