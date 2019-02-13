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
    + Result
    + Task
  - [Utilities](#utilities)
    + encase
    + get
    + head
    + tail
    + slice
    + range
    + parseDate
    + parseFloat
    + parseInt
    + compose
    + pipe

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
    Just: age => console.log(age) // 9
    Nothing: () => console.log(`This function won't run`)
  })

// Example with real data
Maybe(person)
  .chain(p => Maybe(p.age)) // maybe age might be null
  .map(age => age + 5)
  .cata({
    Just: age => console.log(age) // this function won't run because the data is null
    Nothing: () => console.log('This function runs')
  })

// Example with null data
Maybe(null)
  .map(p => p.age)
  .map(age => age + 5)
  .cata({
    Just: age => console.log(age) // this function won't run because the data is null
    Nothing: () => console.log('This function runs')
  })

// Example with default data
Maybe(null)
  .map(p => p.age)
  .map(age => age + 5)
  .default(() => 99) // the data is null so 99 is the default
  .cata({
    Just: age => console.log(age) // 99
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
    Just: () => console.log(`This function won't run`)
    Nothing: () => console.log(`This function runs`)
  })
```

### Utilities
*Coming soon...*