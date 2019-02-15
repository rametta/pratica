import { Ok, Err } from './../src/result'

describe('Result', () => {

  const person = { name: 'jason', age: 4 }

  it('should have map', done => {
    Ok(person)
      .map(p => p.name)
      .cata({
        Ok: name => expect(name).toBe('jason'),
        Err: done.fail
      })

    done()
  })

  it('should have chain', done => {
    Ok(person)
      .map(p => p.name)
      .chain(name => name === 'jason' ? Ok(name) : Err('Name not jason'))
      .cata({
        Ok: name => expect(name).toBe('jason'),
        Err: done.fail
      })

    Ok(person)
      .map(p => p.name)
      .chain(name => name !== 'jason' ? Ok(name) : Err('Name is jason'))
      .cata({
        Ok: done.fail,
        Err: msg => expect(msg).toBe('Name is jason')
      })

    done()
  })

  it('should have ap', done => {
    const add = x => y => x + y
    const one = Ok(1)
    const two = Ok(2)

    Ok(add)
      .ap(one)
      .ap(two)
      .cata({
        Ok: x => expect(x).toBe(3),
        Err: done.fail
      })

    done()
  })

  it('should ignore mapErr if Ok', done => {

    Ok('hello')
      .mapErr(x => x + 'wedwed')
      .map(x => x + ' world')
      .mapErr(x => x + 'wedwed')
      .cata({
        Ok: x => expect(x).toBe('hello world'),
        Err: done.fail
      })

    done()
  })

  it('should ignore chainErr if Ok', done => {

    Ok('hello')
      .chainErr(x => Err(x + 'wedwed'))
      .map(x => x + ' world')
      .chainErr(x => Err(x + 'wedwed'))
      .cata({
        Ok: x => expect(x).toBe('hello world'),
        Err: done.fail
      })

    done()
  })

  it('should use mapErr if Err', done => {

    Err('hello')
      .mapErr(x => x + ' some err')
      .map(x => x + ' world')
      .mapErr(x => x + ' some err')
      .cata({
        Ok: done.fail,
        Err: x => expect(x).toBe('hello some err some err')
      })

    done()
  })

  it('should use chainErr if Err', done => {

    Err('hello')
      .chainErr(x => Err(x + ' some err'))
      .map(x => x + ' world')
      .chainErr(x => Err(x + ' some err'))
      .cata({
        Ok: done.fail,
        Err: x => expect(x).toBe('hello some err some err')
      })

    done()
  })

  it('should flip back to Ok if chainErr returns an Ok', done => {

    Err('hello')
      .chainErr(x => Err(x + ' some err'))
      .map(x => x + ' world')
      .chainErr(x => Ok(x + ' not some err'))
      .cata({
        Ok: x => expect(x).toBe('hello some err not some err'),
        Err: done.fail
      })

    Err('hello')
      .chainErr(x => Ok(x + ' some err'))
      .map(x => x + ' world')
      .cata({
        Ok: x => expect(x).toBe('hello some err world'),
        Err: done.fail
      })

    done()
  })

})