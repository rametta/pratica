import { nullable, Maybe, Nothing, Just } from "./maybe"

export const parseDate = (date: string | number | undefined | null): Maybe<Date> =>
  nullable(date)
    .map((d) => new Date(d))
    .chain((d) => (isNaN(d.valueOf()) ? Nothing : Just(d)))
