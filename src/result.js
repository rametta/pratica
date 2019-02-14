const isProperCata = obj => obj.Ok && obj.Err
const improperCata = () => { throw new Error('Cata missing Ok or Err') }

export const Ok = arg => ({
  ap: cb => cb.map(x => arg(x)),
  map: cb => Ok(cb(arg)),
  chain: cb => cb(arg),
  cata: obj => isProperCata(obj)
    ? obj.Ok(arg)
    : improperCata(),
  inspect: () => `Ok(${arg})`,
  isErr: () => false,
  isOk: () => true
})

export const Err = arg => ({
  ap: Err,
  map: Err,
  chain: Err,
  cata: obj => isProperCata(obj)
    ? obj.Err(arg)
    : improperCata(),
  inspect: () => `Err(${arg})`,
  isErr: () => true,
  isOk: () => false
})
