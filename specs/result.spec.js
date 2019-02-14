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

})