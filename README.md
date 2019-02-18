[![npm](https://img.shields.io/npm/v/pratica.svg)](http://npm.im/pratica)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)
[![Open Source Love](https://badges.frapsoft.com/os/v1/open-source.svg?v=103)](https://github.com/rametta/pratica/)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

# 🥃 Pratica

> Functional Programming for Pragmatists

*Why is this for pragmatists you say?*

Pratica sacrifices some common FP guidelines in order to provide a simpler and more approachable API that can be used to accomplish your goals quickly - while maintaining data integrity and saftey, through algrebraic data types.

## Install
```sh
yarn add pratica
```

## Documentation

Table of Contents
  - [Monads](#monads)
    + [Maybe](#maybe)
    + [Result](#result)
  - [Utilities](#utilities)
    + [encase](#encase)
    + [encaseRes](#encaseRes)
    + [justs](#justs)
    + [oks](#oks)
    + [get](#get)
    + [head](#head)
    + [last](#last)
    + [tail](#tail)
    + [tryFind](#tryfind)
    + [parseDate](#parsedate)

### Monads

#### Maybe

Use this when dealing with nullable and unreliable data that needs actions performed upon.

Maybe is great for making sure you do not cause runtime errors by accessing data that is not there because of unexpected nulls or undefineds

```js
import { Maybe } from 'pratica'

const person = { name: 'Jason', age: 4 }

// Example with real data
Maybe(person)
  .map(p => p.age)
  .map(age => age + 5)
  .cata({
    Just: age => console.log(age), // 9
    Nothing: () => console.log(`This function won't run`)
  })

// Example with real data
Maybe(null)
  .chain(p => Maybe(p.age)) // maybe age might be null
  .map(age => age + 5)
  .cata({
    Just: age => console.log(age), // this function won't run because the data is null
    Nothing: () => console.log('This function runs')
  })

// Example with null data
Maybe(null)
  .map(p => p.age)
  .map(age => age + 5)
  .cata({
    Just: age => console.log(age), // this function won't run because the data is null
    Nothing: () => console.log('This function runs')
  })

// Example with default data
Maybe(null)
  .map(p => p.age)
  .map(age => age + 5)
  .default(() => 99) // the data is null so 99 is the default
  .cata({
    Just: age => console.log(age), // 99
    Nothing: () => console.log(`This function won't run`)
  })
```

Sometime's working with Maybe can be reptitive to always call .map whenever needing to a apply a function to the contents of the Maybe. Here is an example using `.ap` to simplify this.

Goal of this example, to perform operations on data inside the Maybe, without unwrapping the data with `.map` or `.chain`
```js
// Need something like this
// Maybe(6) + Maybe(7) = Maybe(13)
Maybe(x => y => x + y)
  .ap(Maybe(6))
  .ap(Maybe(7))
  .cata({
    Just: result => console.log(result), // 13
    Nothing: () => console.log(`This function won't run`)
  })

Maybe(null) // no function to apply
  .ap(Maybe(6))
  .ap(Maybe(7))
  .cata({
    Just: () => console.log(`This function won't run`),
    Nothing: () => console.log(`This function runs`)
  })
```

#### Result
Use this when dealing with conditional logic. Often a replacment for if statements - or for simplifyinf complex logic trees. A Result can either be a `Ok` or an `Err` type.

Example 1: Name check
```js
import { Ok, Err } from 'pratica'

const person = { name: 'jason', age: 4 }

Ok(person)
  .map(p => p.name)
  .chain(name => name === 'jason' ? Ok(name) : Err('Name not jason'))
  .cata({
    Ok: name => console.log(name), // 'jason'
    Err: msg => console.error(msg) // this func does not run, but if it did, it would be 'Name not jason'
  })
```

Example 2: Many checks
```js
const person = { name: 'Jason', age: 4 }

const isPerson = p => p.name && p.age
  ? Ok(p)
  : Err('Not a person')

const isOlderThan2 = p => p.age > 2
  ? Ok(p)
  : Err('Not older than 2')

const isJason = p => p.name === 'jason'
  ? Ok(p)
  : Err('Not jason')

Ok(person)
  .chain(isPerson)
  .chain(isOlderThan2)
  .chain(isJason)
  .cata({
    Ok: p => console.log('this person satisfies all the checks'),
    Err: msg => console.log(msg) // if any checks return an Err, then this function will be called. If isPerson returns Err, then isOlderThan2 and isJason functions won't even execute, and the err msg would be 'Not a person'
  })
```

You can also modify errors that may return from any result before getting the final result, by using `.mapErr` or `.chainErr`.

Example using `.mapErr`
```js
import { Err } from 'pratica'

Err('Message:')
  .mapErr(x => x + ' Syntax Error')
  .map(x => x + 7) // ignored because it's an error
  .cata({
    Ok: x => console.log(x), // function not ran
    Err: x => console.log(x) // 'Message: Syntax Error'
  })
```

Example using `.chainErr`
```js
import { Err } from 'pratica'

Err('Message:')
  .chainErr(x => x + Err(' Syntax Error'))
  .map(x => x + 7) // ignored because it's an error
  .cata({
    Ok: x => console.log(x), // function not ran
    Err: x => console.log(x) // 'Message: Syntax Error'
  })
```

Use `.swap()` to convert an Err to an Ok, or an Ok to an Err.
```js
import { ok } from 'pratica'

Ok('hello')
  .swap()
  .cata({
    Ok: () => console.log(`doesn't run`),
    Err: x => expect(x).toBe('hello') // true
  })
```

Use `.bimap()` for easily modifying an Ok or an Err
```js
import { ok } from 'pratica'

Ok('hello')
  .bimap(x => x + ' world', x => x + ' goodbye')
  .cata({
    Ok: x => expect(x).toBe('hello world'), // true
    Err: () => {}
  })

Err('hello')
  .bimap(x => x + ' world', x => x + ' goodbye')
  .cata({
    Ok: () => {},
    Err: x => expect(x).toBe('hello goodbye') // true
  })
```

### Utilities
#### parseDate
Safely parse date strings. parseDate returns a Maybe monad.
```js
import { parseDate } from 'pratica'

const goodDate = '2019-02-13T21:04:10.984Z'
const badDate = '2019-02-13T21:04:1'

parseDate(goodDate).cata({
  Just: date => expect(date.toISOString()).toBe(goodDate),
  Nothing: () => console.log('could not parse date string') // this function doesn't run
})

parseDate(badDate).cata({
  Just: () => console.log(`this function doesn't run`),
  Nothing: () => 'this function runs'
})

// it's a maybe, so you can use chain/default/ap
parseDate(null)
  .default(() => new Date())
  .cata({
    Just: date => date.toISOString(), // this runs
    Nothing: () => `doesn't run because of the .default()`
  })
```

#### encase
Safely run functions that may throw an error or crash. encase returns a Maybe type (so Just or Nothing).
```js
import { encase } from 'pratica'

const throwableFunc = () => JSON.parse('<>')

// this func doesn't throw, so Just is called
encase(() => 'hello').cata({
  Just: x => console.log(x), // hello
  Nothing: () => console.log('func threw error') // this func doesn't run
})

// this function throws an error so Nothing is called
encase(throwableFunc).cata({
  Just: json => console.log(`doesn't run`),
  Nothing: () => console.error('func threw an error') // this runs
})
```

#### encaseRes
Safely run functions that may throw an error or crash. encase returns a Result type (so Ok or Err). Similar to `encase` but the Err returns the error message.
```js
import { encaseRes } from 'pratica'

const throwableFunc = () => JSON.parse('<>')

// this func doesn't throw, so Ok is called
encaseRes(() => 'hello').cata({
  Ok: x => console.log(x), // hello
  Err: () => console.log('func threw error') // this func doesn't run
})

// this function throws an error so Err is called
encaseRes(throwableFunc).cata({
  Ok: json => console.log(`doesn't run`),
  Err: msg => console.error(msg) // SyntaxError: Unexpected token < in JSON at position 0
})
```

#### justs
Filter out any non-Just data type from an array

```js
import { justs } from 'pratica'

const data = [1, true, Just('hello'), Nothing, Ok('hey'), Err('No good')]

justs(data) // returns [Just('hello')]
```

#### oks
Filter out any non-Ok data type from an array

```js
import { oks } from 'pratica'

const data = [1, true, Just('hello'), Nothing, Ok('hey'), Err('No good')]

oks(data) // returns [Ok('hey')]
```

#### get
Safely retrieve a nested property in an object. Returns a Maybe.
```js
import { get } from 'pratica'

const data = {
  name: 'jason',
  children: [
    {
      name: 'bob'
    },
    {
      name: 'blanche',
      children: [
        {
          name: 'lera'
        }
      ]
    }
  ]
}

get(['children', 1, 'children', 0, 'name'])(data).cata({
  Just: name => expect(name).toBe('lera'), // true
  Nothing: () => console.log('no name') // doesn't run
})
```

#### head
Safely get the first item in an array. Returns a Maybe.
```js
import { head } from 'pratica'

const data = [5,1,2]

// example with data
head(data)
  .cata({
    Just: x => expect(x).toBe(5), // true,
    Nothing: () => console.log('No head') // won't run
  })

// example with empty data
head([])
  .cata({
    Just: x => console.log(x), // doesn't run
    Nothing: () => console.log('No head') // runs 
  })
```

#### last
Safely get the last item in an array. Returns a Maybe.
```js
import { last } from 'pratica'

const data = [5,1,2]

// example with data
last(data)
  .cata({
    Just: x => expect(x).toBe(2), // true,
    Nothing: () => console.log('No last') // won't run
  })

// example with empty data
last([])
  .cata({
    Just: x => console.log(x), // doesn't run
    Nothing: () => console.log('No last') // runs 
  })
```

#### tail
Safely get the tail of an array (Everything except the first element). Returns a Maybe.
```js
import { tail } from 'pratica'

const data = [5,1,2]

// example with data
tail(data)
  .cata({
    Just: x => expect(x).toEqual([1,2]), // true,
    Nothing: () => console.log('No tail') // won't run
  })

// example with empty data
last([])
  .cata({
    Just: x => console.log(x), // doesn't run
    Nothing: () => console.log('No tail') // runs 
  })
```

#### tryFind
Safely try to retrieve an item from an array. Returns a Maybe.

```js
import { tryFind } from 'pratica'

const users = [
  {name: 'jason', age: 6, id: '123abc'},
  {name: 'bob', age: 68, id: '456def'}
]

tryFind(u => u.id === '123abc')(users)
  .cata({
    Just: user => expect(user).toEqual(users[0]), // true
    Nothing: () => 'Could not find user with id 123abc' // doesn't run
  })
```
