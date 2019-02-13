const { Maybe } = require('./../src/index')

describe('Maybe', () => {

  it('should be a functor and implement map', () => {
    Maybe('hello')
      .map(x => `${x} world`)
      .map(x => expect(x).toEqual('hello world'))
  })

  it('should handle nullable data', () => {
    expect(Maybe(null).isNothing()).toEqual(true)
    expect(Maybe(null).isJust()).toEqual(false)
    expect(Maybe('some data').isNothing()).toEqual(false)
    expect(Maybe('some data').isJust()).toEqual(true)
  })

  it('should implment chain', () => {
    Maybe('hello')
      .chain(x => Maybe(x))
      .map(x => x + ' world')
      .map(x => expect(x).toEqual('hello world'))

    const x = Maybe('hello')
      .chain(x => Maybe(null))
      .map(x => x + ' world')
      .map(x => expect(x).toEqual('hello world '))

    expect(x.isNothing()).toBe(true)
    expect(x.isJust()).toBe(false)
  })

  it('should implement cata', done => {
    Maybe('hello')
      .map(x => x + ' world')
      .cata({
        Just: x => expect(x).toBe('hello world'),
        Nothing: () => done.fail()
      })

    Maybe(null)
      .map(() => done.fail())
      .chain(() => done.fail())
      .cata({
        Just: () => done.fail(),
        Nothing: () => done()
      })

    expect(() => Maybe().cata({})).toThrow()
  })

})