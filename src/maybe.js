import { Ok, Err } from './result'
const isProperCata = obj => obj.Just && obj.Nothing
const improperCata = () => { throw new Error('Cata missing Just or Nothing') }

export const Just = arg => ({
  ap: cb => cb.map(x => arg(x)),
  map: (...cbs) => Just(cbs.reduce((acc, cb) => cb(acc), arg)),
  chain: cb => cb(arg),
  default: () => Just(arg),
  cata: obj => isProperCata(obj)
    ? obj.Just(arg)
    : improperCata(),
  toResult: () => Ok(arg),
  inspect: () => `Just(${arg})`,
  isNothing: () => false,
  isJust: () => true
})

export const Nothing = ({
  ap: () => Nothing,
  map: () => Nothing,
  chain: () => Nothing,
  default: cb => Just(cb()),
  cata: obj => isProperCata(obj)
    ? obj.Nothing()
    : improperCata(),
  toResult: () => Err(),
  inspect: () => `Nothing`,
  isNothing: () => true,
  isJust: () => false
})

export const Maybe = arg => arg === null || arg === undefined
  ? Nothing
  : Just(arg)