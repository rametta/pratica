import { nullable } from '../src/maybe'

describe('Maybe', () => {

  it('should be a functor and implement map', () => {
    nullable('hello')
      .map(x => `${x} world`)
      .map(x => expect(x).toEqual('hello world'))
  })

  it('should handle nullable data', () => {
    expect(nullable(null).isNothing()).toEqual(true)
    expect(nullable(null).isJust()).toEqual(false)
    expect(nullable('some data').isNothing()).toEqual(false)
    expect(nullable('some data').isJust()).toEqual(true)
  })

  it('should implement chain', done => {
    nullable('hello')
      .chain(x => nullable(x))
      .map(x => x + ' world')
      .cata({
        Just: x => expect(x).toBe('hello world'),
        Nothing: () => done.fail()
      })

      nullable(null)
      .chain(x => nullable(x))
      .map(x => x + ' world')
      .cata({
        Just: () => done.fail(),
        Nothing: done
      })

    const x = nullable('hello')
      .chain(x => nullable(null))
      .map(x => x + ' world')
      .map(x => expect(x).toEqual('hello world '))

    expect(x.isNothing()).toBe(true)
    expect(x.isJust()).toBe(false)
    done()
  })

  it('should implement cata', done => {
    nullable('hello')
      .map(x => x + ' world')
      .cata({
        Just: x => expect(x).toBe('hello world'),
        Nothing: () => done.fail('Should not be Nothing')
      })

      nullable(null)
      .map(() => done.fail())
      .chain(() => done.fail())
      .cata({
        Just: () => done.fail(),
        Nothing: () => done()
      })
  })

  it('should return a default value if nothing', done => {
    nullable(null)
      .alt('some default')
      .cata({
        Just: x => expect(x).toBe('some default'),
        Nothing: () => done.fail('Should not be Nothing')
      })

      nullable('some data')
      .chain(data => nullable(null))
      .alt('some default')
      .cata({
        Just: x => expect(x).toBe('some default'),
        Nothing: () => done.fail('Should not be Nothing')
      })

    done()
  })

  it(`should ignore the default if it's not nothing`, done => {
    nullable({ name: 'jason' })
      .map(person => person.name)
      .alt('some default')
      .cata({
        Just: x => expect(x).toBe('jason'),
        Nothing: () => done.fail('Should not be Nothing')
      })

    done()
  })

  it('should inspect properly', () => {
    expect(nullable('hello').inspect()).toBe('Just(hello)')
    expect(nullable(null).inspect()).toBe('Nothing')
  })

  it('should apply 2 monads with ap', done => {
    const add = (x: number) => (y: number) => x + y
    const one = nullable(1)
    const two = nullable(2)

    nullable(add)
      .ap(one)
      .ap(two)
      .cata({
        Just: x => expect(x).toBe(3),
        Nothing: () => done.fail('Should not be Nothing')
      })

      nullable(null)
      .ap(one)
      .ap(two)
      .cata({
        Just: () => done.fail(),
        Nothing: done
      })

    done()
  })

  it('should convert Maybe to Result', done => {
    nullable(6)
      .toResult()
      .cata({
        Ok: x => expect(x).toBe(6),
        Err: () => done.fail('Should not be Err')
      })

    nullable()
      .toResult()
      .cata({
        Ok: () => done.fail('Should not be Ok'),
        Err: done
      })

    done()
  })
})