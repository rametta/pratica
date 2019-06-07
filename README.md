[![npm](https://img.shields.io/npm/v/pratica.svg)](http://npm.im/pratica)
[![Pratica](https://badgen.net/bundlephobia/minzip/pratica)](https://bundlephobia.com/result?p=pratica)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-blue.svg)](http://makeapullrequest.com)

# 🥃 Pratica

> Functional Programming for Pragmatists

*Why is this for pragmatists you say?*

Pratica sacrifices some common FP guidelines in order to provide a simpler and more approachable API that can be used to accomplish your goals quickly - while maintaining data integrity and saftey, through algrebraic data types.

## Install
With yarn
```sh
yarn add pratica
```
or if you prefer npm
```sh
npm i pratica
```

## Documentation

Table of Contents
  - [Monads](#monads)
    + [Maybe](#maybe)
      + [.map](#maybemap)
      + [.chain](#maybechain)
      + [.ap](#maybeap)
      + [.default](#maybedefault)
      + [.cata](#maybecata)
      + [.toResult](#maybetoresult)
      + [.inspect](#maybeinspect)
      + [.isNothing](#maybeisnothing)
      + [.isJust](#maybeisjust)
    + [Result](#result)
      + [.ap](#resultap)
      + [.map](#resultmap)
      + [.mapErr](#resultmaperr)
      + [.chain](#resultchain)
      + [.chainErr](#resultchainerr)
      + [.bimap](#resultbimap)
      + [.swap](#resultswap)
      + [.cata](#resultcata)
      + [.toMaybe](#resulttomaybe)
      + [.inspect](#resultinspect)
      + [.isErr](#resultiserr)
      + [.isOk](#resultisok)
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

Maybe is great for making sure you do not cause runtime errors by accessing data that is not there because of unexpected nulls or undefineds.

Every Maybe can either be of type `Just` or `Nothing`. When the data is available, it is wrapped with `Just`, if the data is missing, it is `Nothing`. The examples below should clarify futher.

##### Maybe.map
Map is used for running a function on the data inside the Maybe. Map will only run the function if the Maybe type is `Just`. If it's Nothing, the map will [short circuit](https://en.wikipedia.org/wiki/Short-circuit_evaluation) and be skipped.
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

// Example with null data
Maybe(null)
  .map(p => p.age) // Maybe type is Nothing, so this function is skipped
  .map(age => age + 5) // Maybe type is Nothing, so this function is skipped
  .cata({
    Just: age => console.log(age), // Maybe type is Nothing, so this function is not run
    Nothing: () => console.log('Could not get age from person') // This function runs because Maybe is Nothing
  })
```

##### Maybe.chain
Chain is used when you want to return another Maybe when already inside a Maybe.
```js
import { Maybe } from 'pratica'

const person = { name: 'Jason', age: 4 }

Maybe(person)
  .chain(p => Maybe(p.height)) // p.height does not exist so Maybe returns a Nothing type, any .map, .chain, or .ap after a Nothing will be short circuited
  .map(height => height * 2.2) // this func won't even run because height is Nothing, so `undefined * 2.2` will never execute, preventing problems.
  .cata({
    Just: height => console.log(height), // this function won't run because the height is Nothing
    Nothing: () => console.log('This person has no height')
  })
```

##### Maybe.default
Default is a clean way of making sure you always return a Just with some *default* data inside.
```js
import { Maybe } from 'pratica'

// Example with default data
Maybe(null)
  .map(p => p.age) // won't run
  .map(age => age + 5) // won't run
  .default(() => 99) // the data is null so 99 is the default
  .cata({
    Just: age => console.log(age), // 99
    Nothing: () => console.log(`This function won't run because .default always returns a Just`)
  })
```

##### Maybe.ap
Sometime's working with Maybe can be reptitive to always call `.map` whenever needing to a apply a function to the contents of the Maybe. Here is an example using `.ap` to simplify this.

Goal of this example, to perform operations on data inside the Maybe, without unwrapping the data with `.map` or `.chain`
```js
import { Maybe } from 'pratica'

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

##### Maybe.inspect
Inspect is used for seeing a string respresentation of the Maybe. It is used mostly for Node logging which will automatically call inspect() on objects that have it, but you can use it too for debugging if you like.
```js
import { Maybe } from 'pratica'

const { log } = console

log(Maybe(86).inspect()) // `Just(86)`
log(Maybe('HELLO').inspect()) // `Just('HELLO')`
log(Maybe(null).inspect()) // `Nothing`
log(Maybe(undefined).inspect()) // `Nothing`
```

##### Maybe.cata
Cata is used at the end of your chain of computations. It is used for getting the final data from the Maybe. You must pass an object to `.cata` with 2 properties, `Just` and `Nothing` *(capitalization matters)*, and both those properties must be a function. Those functions will run based on if the the computations above it return a Just or Nothing data type.

Cata stands for catamorphism and in simple terms means that it extracts a value from inside any container.

```js
import { Just, Nothing } from 'pratica'

const isOver6Feet = person => person.height > 6
  ? Just(person.height)
  : Nothing

isOver6Feet({ height: 4.5 })
  .map(h => h / 2.2)
  .cata({
    Just: h => console.log(h), // this function doesn't run
    Nothing: () => console.log(`person is not over 6 feet`)
  })
```

##### Maybe.toResult
toResult is used for easily converting Maybe's to Result's. Any Maybe that is a Just will be converted to an Ok with the same value inside, and any value that was Nothing will be converted to an Err with no value passed. The cata will have to include `Ok` and `Err` instead of `Just` and `Nothing`.

```js
import { Just, Nothing } from 'pratica'

Just(8)
  .toResult()
  .cata({
    Ok: n => console.log(n), // 8
    Err: () => console.log(`No value`) // this function doesn't run
  })

Nothing
  .toResult()
  .cata({
    Ok: n => console.log(n), // this function doesn't run
    Err: () => console.log(`No value`) // this runs
  })
```

##### Maybe.isJust
isJust returns a boolean representing the type of the Maybe. If the Maybe is a Just type then true is returned, if it's a Nothing, returns false.

```js
import { Just, Nothing } from 'pratica'

const isOver6Feet = height => height > 6
  ? Just(height)
  : Nothing

const { log } = console

log(isOver6Feet(7).isJust()) // true
log(isOver6Feet(4).isJust()) // false
```

##### Maybe.isNothing
isNothing returns a boolean representing the type of the Maybe. If the Maybe is a Just type then false is returned, if it's a Nothing, returns true.

```js
import { Just, Nothing } from 'pratica'

const isOver6Feet = height => height > 6
  ? Just(height)
  : Nothing

const { log } = console

log(isOver6Feet(7).isNothing()) // false
log(isOver6Feet(4).isNothing()) // true
```

#### Result
Use this when dealing with conditional logic. Often a replacment for if statements - or for simplifying complex logic trees. A Result can either be an `Ok` or an `Err` type.

##### Result.map
```js
import { Ok, Err } from 'pratica'

const person = { name: 'jason', age: 4 }

Ok(person)
  .map(p => p.name)
  .cata({
    Ok: name => console.log(name), // 'jason'
    Err: msg => console.error(msg) // this func does not run
  })
```

##### Result.chain

```js
import { Ok, Err } from 'pratica'

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

##### Result.mapErr

You can also modify errors that may return from any result before getting the final result, by using `.mapErr` or `.chainErr`.

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

##### Result.chainErr
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

##### Result.swap
Use `.swap()` to convert an Err to an Ok, or an Ok to an Err.
```js
import { Ok } from 'pratica'

Ok('hello')
  .swap()
  .cata({
    Ok: () => console.log(`doesn't run`),
    Err: x => expect(x).toBe('hello') // true
  })
```

##### Result.bimap
Use `.bimap()` for easily modifying an Ok or an Err. Shorthand for providing both `.map` and `.mapErr`
```js
import { Ok } from 'pratica'

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

##### Result.ap
```js
import { Ok } from 'pratica'

// Need something like this
// Ok(6) + Ok(7) = Ok(13)
Ok(x => y => x + y)
  .ap(Ok(6))
  .ap(Ok(7))
  .cata({
    Ok: result => console.log(result), // 13
    Err: () => console.log(`This function won't run`)
  })

Ok(null) // no function to apply
  .ap(Ok(6))
  .ap(Ok(7))
  .cata({
    Ok: () => console.log(`This function won't run`),
    Err: () => console.log(`This function runs`)
  })
```

##### Result.inspect
```js
import { Ok, Err } from 'pratica'

const { log } = console

log(Ok(86).inspect()) // `Ok(86)`
log(Ok('HELLO').inspect()) // `Ok('HELLO')`
log(Err('Something happened').inspect()) // `Err('Something happened')`
log(Err(404).inspect()) // `Err(404)`
```

##### Result.cata
```js
import { Ok, Err } from 'pratica'

const isOver6Feet = person => person.height > 6
  ? Ok(person.height)
  : Err('person is not over 6 feet')

isOver6Feet({ height: 4.5 })
  .map(h => h / 2.2)
  .cata({
    Ok: h => console.log(h), // this function doesn't run
    Err: msg => console.log(msg) // `person is not over 6 feet`
  })
```

##### Result.toMaybe
toMaybe is used for easily converting Result's to Maybe's. Any Result that is an Ok will be converted to a Just with the same value inside, and any value that was Err will be converted to a Nothing with no value passed. The cata will have to include `Just` and `Nothing` instead of `Ok` and `Err`.

```js
import { Ok, Err } from 'pratica'

Ok(8)
  .toMaybe()
  .cata({
    Just: n => console.log(n), // 8
    Nothing: () => console.log(`No value`) // this function doesn't run
  })

Err(8)
  .toMaybe()
  .cata({
    Just: n => console.log(n), // this function doesn't run
    Nothing: () => console.log(`No value`) // this runs
  })
```

##### Result.isOk
```js
import { Ok, Err } from 'pratica'

const isOver6Feet = height => height > 6
  ? Ok(height)
  : Err('Shorty')

const { log } = console

log(isOver6Feet(7).isOk()) // true
log(isOver6Feet(4).isOk()) // false
```

##### Result.isErr
```js
import { Ok, Err } from 'pratica'

const isOver6Feet = height => height > 6
  ? Ok(height)
  : Err('Shorty')

const { log } = console

log(isOver6Feet(7).isErr()) // false
log(isOver6Feet(4).isErr()) // true
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
Safely run functions that may throw an error or crash. encaseRes returns a Result type (so Ok or Err). Similar to `encase` but the Err returns the error message.
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
