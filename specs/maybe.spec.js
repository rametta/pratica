import { Maybe } from './../src/maybe'

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

  it('should implement chain', done => {
    Maybe('hello')
      .chain(x => Maybe(x))
      .map(x => x + ' world')
      .cata({
        Just: x => expect(x).toBe('hello world'),
        Nothing: done.fail
      })

    Maybe(null)
      .chain(x => Maybe(x))
      .map(x => x + ' world')
      .cata({
        Just: done.fail,
        Nothing: done
      })

    const x = Maybe('hello')
      .chain(x => Maybe(null))
      .map(x => x + ' world')
      .map(x => expect(x).toEqual('hello world '))

    expect(x.isNothing()).toBe(true)
    expect(x.isJust()).toBe(false)
    done()
  })

  it('should implement cata', done => {
    Maybe('hello')
      .map(x => x + ' world')
      .cata({
        Just: x => expect(x).toBe('hello world'),
        Nothing: () => done.fail('Should not be Nothing')
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

  it('should return a default value if nothing', done => {
    Maybe(null)
      .default(() => 'some default')
      .cata({
        Just: x => expect(x).toBe('some default'),
        Nothing: () => done.fail('Should not be Nothing')
      })

    Maybe('some data')
      .chain(data => Maybe(null))
      .default(() => 'some default')
      .cata({
        Just: x => expect(x).toBe('some default'),
        Nothing: () => done.fail('Should not be Nothing')
      })

    done()
  })

  it(`should ignore the default if it's not nothing`, done => {
    Maybe({ name: 'jason' })
      .map(person => person.name)
      .default(() => 'some default')
      .cata({
        Just: x => expect(x).toBe('jason'),
        Nothing: () => done.fail('Should not be Nothing')
      })

    done()
  })

  it('should inspect properly', () => {
    expect(Maybe('hello').inspect()).toBe('Just(hello)')
    expect(Maybe(null).inspect()).toBe('Nothing')
  })

  it('should apply 2 monads with ap', done => {
    const add = x => y => x + y
    const one = Maybe(1)
    const two = Maybe(2)

    Maybe(add)
      .ap(one)
      .ap(two)
      .cata({
        Just: x => expect(x).toBe(3),
        Nothing: () => done.fail('Should not be Nothing')
      })

    Maybe(null)
      .ap(one)
      .ap(two)
      .cata({
        Just: () => done.fail(),
        Nothing: done
      })

    done()
  })

  it('should convert Maybe to Result', done => {
    Maybe(6)
      .toResult()
      .cata({
        Ok: x => expect(x).toBe(6),
        Err: () => done.fail('Should not be Err')
      })

    Maybe()
      .toResult()
      .cata({
        Ok: () => done.fail('Should not be Ok'),
        Err: done
      })

    done()
  })

})