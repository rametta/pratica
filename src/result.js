const isProperCata = obj => obj.Ok && obj.Err
const improperCata = () => { throw new Error('Cata missing Ok or Err') }

export const Ok = arg => ({
  ap: cb => cb.map(x => arg(x)),
  map: cb => Ok(cb(arg)),
  mapErr: () => Ok(arg),
  chain: cb => cb(arg),
  chainErr: () => Ok(arg),
  swap: () => Err(arg),
  bimap: (ok, err) => Ok(ok(arg)),
  cata: obj => isProperCata(obj)
    ? obj.Ok(arg)
    : improperCata(),
  inspect: () => `Ok(${arg})`,
  isErr: () => false,
  isOk: () => true
})

export const Err = arg => ({
  ap: () => Err(arg),
  map: () => Err(arg),
  mapErr: cb => Err(cb(arg)),
  chain: () => Err(arg),
  chainErr: cb => cb(arg),
  swap: () => Ok(arg),
  bimap: (ok, err) => Err(err(arg)),
  cata: obj => isProperCata(obj)
    ? obj.Err(arg)
    : improperCata(),
  inspect: () => `Err(${arg})`,
  isErr: () => true,
  isOk: () => false
})
