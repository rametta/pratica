const isProperCata = obj => obj.Just && obj.Nothing
const improperCata = () => { throw new Error('Cata missing Just or Maybe') }

export const Just = arg => ({
  map: cb => Just(cb(arg)),
  chain: cb => cb(arg),
  default: () => {},
  cata: obj => isProperCata(obj)
    ? obj.Just(arg)
    : improperCata(),
  inspect: () => `Just(${arg})`,
  isNothing: () => false,
  isJust: () => true
})

export const Nothing = ({
  map: () => Nothing,
  chain: () => Nothing,
  default: cb => Maybe(cb()),
  cata: obj => isProperCata(obj)
    ? obj.Nothing()
    : improperCata(),
  inspect: () => `Nothing`,
  isNothing: () => true,
  isJust: () => false
})

export const Maybe = arg => arg === null || arg === undefined
  ? Nothing
  : Just(arg)
